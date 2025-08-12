# Based on BS-RoFormer implementation by Phil Wang (lucidrains)
# Original: https://github.com/lucidrains/BS-RoFormer
# License: MIT
# Modified for Musetric project

import logging

import torch
import torch.nn.functional as F
from torch import einsum, nn
from torch.nn.attention import SDPBackend

_backends_logged = False


def log_selected_backend(q, k, v, backends):
    global _backends_logged
    if not _backends_logged:
        backend_names = [b.name for b in backends]
        logging.debug(f"Available SDPA backends for attention: {backend_names}")

        # Try to determine which backend will be used by testing each one
        import warnings

        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            for backend in backends:
                try:
                    with torch.nn.attention.sdpa_kernel([backend]):
                        F.scaled_dot_product_attention(
                            q[:1], k[:1], v[:1], dropout_p=0.0
                        )
                    logging.debug(f"Selected SDPA backend: {backend.name}")
                    break
                except Exception:
                    continue
            else:
                logging.debug("Selected SDPA backend: MATH (fallback)")

        _backends_logged = True


class Attend(nn.Module):
    def __init__(self, dropout, flash):
        super().__init__()
        self.dropout = dropout
        self.attn_dropout = nn.Dropout(dropout)
        self.flash = flash

    def flash_attn(self, q, k, v):
        backends = [
            SDPBackend.FLASH_ATTENTION,
            SDPBackend.EFFICIENT_ATTENTION,
            SDPBackend.MATH,
        ]
        log_selected_backend(q, k, v, backends)

        with torch.nn.attention.sdpa_kernel(backends):
            return F.scaled_dot_product_attention(
                q, k, v, dropout_p=self.dropout if self.training else 0.0
            )

    def forward(self, q, k, v):
        if self.flash:
            return self.flash_attn(q, k, v)

        global _backends_logged
        if not _backends_logged:
            logging.debug("Using manual attention computation (einsum-based)")
            _backends_logged = True
        scale = q.shape[-1] ** -0.5
        sim = einsum("b h i d, b h j d -> b h i j", q, k) * scale
        attn = self.attn_dropout(sim.softmax(dim=-1))
        return einsum("b h i j, b h j d -> b h i d", attn, v)
