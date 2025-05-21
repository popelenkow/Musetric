import sqlite3
from contextlib import contextmanager
from pathlib import Path

from musetric.common.path import databasePath


def connectDb():
    Path(databasePath).parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(databasePath)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


@contextmanager
def connectDbTransaction():
    connection = connectDb()
    cursor = connection.cursor()
    cursor.row_factory = sqlite3.Row
    try:
        yield cursor, connection
    except Exception as exception:
        connection.rollback()
        raise exception
    else:
        connection.commit()
    finally:
        cursor.close()
        connection.close()


def initDb():
    with connectDbTransaction() as (cursor, _):
        cursor.execute(
            """--sql
            CREATE TABLE IF NOT EXISTS project (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                stage TEXT NOT NULL
            )
            """
        )
        cursor.execute(
            """--sql
            CREATE TABLE IF NOT EXISTS sound (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                projectId INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                data BLOB NOT NULL,
                filename TEXT NOT NULL,
                contentType TEXT NOT NULL
            )
            """
        )
        cursor.execute(
            """--sql
            CREATE TABLE IF NOT EXISTS preview (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                projectId INTEGER NOT NULL UNIQUE REFERENCES project(id) ON DELETE CASCADE,
                data BLOB NOT NULL,
                filename TEXT NOT NULL,
                contentType TEXT NOT NULL
            )
            """
        )
