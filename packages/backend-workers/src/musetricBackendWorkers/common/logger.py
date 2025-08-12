import json
import logging
import sys
from typing import Any


class JSONFormatter(logging.Formatter):
    levelMap = {"DEBUG": "debug", "INFO": "info", "WARNING": "warn", "ERROR": "error"}

    def format(self, record):
        mappedLevel = self.levelMap.get(record.levelname, "info")
        logEntry = {"level": mappedLevel, "message": record.getMessage()}
        return json.dumps(logEntry)


def setupLogging(level: str):
    levelMap = {"debug": "DEBUG", "info": "INFO", "warn": "WARNING", "error": "ERROR"}

    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(JSONFormatter())

    rootLogger = logging.getLogger()
    pythonLevel = levelMap.get(level, "INFO")
    rootLogger.setLevel(getattr(logging, pythonLevel))

    for existingHandler in rootLogger.handlers[:]:
        rootLogger.removeHandler(existingHandler)

    rootLogger.addHandler(handler)

    logging.captureWarnings(True)


def sendMessage(message: dict[str, Any]) -> None:
    print(json.dumps(message), flush=True)
