from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute

from musetric.api.preview import previewRouter
from musetric.api.project import projectRouter
from musetric.api.sound import soundRouter
from musetric.api.swagger import swaggerRouter
from musetric.common.error import NotFoundError


async def handleNotFoundError(request: Request, exception: NotFoundError):
    detail = str(exception)
    return JSONResponse(
        status_code=404,
        content={"detail": detail},
    )


def includeRouters(app: FastAPI):
    app.add_exception_handler(NotFoundError, handleNotFoundError)

    def includeRouter(router):
        for route in router.routes:
            if isinstance(route, APIRoute):
                argsName = route.name[0].upper() + route.name[1:] + "Args"
                route.generate_unique_id_function = lambda _: argsName
        app.include_router(router)

    includeRouter(projectRouter)
    includeRouter(soundRouter)
    includeRouter(previewRouter)
    includeRouter(swaggerRouter)

    for route in app.router.routes:
        if isinstance(route, APIRoute):
            route.summary = route.name
            route.operation_id = route.name
