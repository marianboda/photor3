CREATE TABLE "dir"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"path" Text NOT NULL,
	"name" Text NOT NULL,
    "mTime" Text,
    "birthTime" Text,
	"filesCount" Integer,
	"deepFilesCount" Integer,
	"deepUnrecognizedCount" Integer,
	"scanTime" Text,
	"processTime" Text,
	"hash" Text );

CREATE UNIQUE INDEX "photo_path" ON "dir" ( "path" );

CREATE TABLE "file"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name" Text NOT NULL,
	"path" Text NOT NULL,
	"dir" Text NOT NULL,
	"size" Integer,
    "mTime" Text,
    "birthTime" Text,
	"status" Integer DEFAULT 0,
	"exif" Text,
	"hash" Text,
	"scanTime" Text,
	"processTime" Text );

CREATE UNIQUE INDEX "dir_path" ON "file" ( "path" );

-- CREATE TABLE "ignore_path"(
-- 	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
-- 	"path" Text NOT NULL );

-- CREATE TABLE "scanning_path"(
-- 	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
-- 	"path" Text NOT NULL );

-- CREATE UNIQUE INDEX "scanning_path_path" ON "scanning_path"( "path" );