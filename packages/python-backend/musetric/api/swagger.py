from fastapi import APIRouter, Response
from fastapi.openapi.docs import get_swagger_ui_html

swaggerRouter = APIRouter()


@swaggerRouter.get("/docs", include_in_schema=False)
async def getDocs():
    swagger_ui_html = get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Swagger UI",
    )

    htmlText = (
        swagger_ui_html.body.decode("utf-8")
        + '<link type="text/css" rel="stylesheet" href="https://popelenkow.github.io/SwaggerDark/SwaggerDark.css">'
    )

    return Response(content=htmlText, media_type="text/html")
