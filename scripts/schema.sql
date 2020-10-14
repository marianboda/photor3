CREATE TABLE "disk"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name" Text NOT NULL
	);

CREATE TABLE "dir"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"disk" Integer NOT NULL,
	"dir" Text NOT NULL,
	"name" Text NOT NULL,
    "mTime" DateTime,
    "birthTime" DateTime,
	"filesCount" Integer,
	"scanTime" DateTime,
	"processTime" DateTime,
	"hash" Text );

CREATE UNIQUE INDEX "dir_disk_dir_name" ON "dir" ("disk", "dir", "name");

CREATE TABLE "file"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"disk" Integer NOT NULL,
	"name" Text NOT NULL,
	"extension" Text,
	"dir" Text NOT NULL,
	"size" Integer,
    "mTime" DateTime,
    "birthTime" DateTime,
	"status" Integer DEFAULT 0,
	"hash" Text,
	"scanTime" DateTime,
	"processTime" DateTime );

CREATE UNIQUE INDEX "file_disk_dir_name" ON "file " ("disk", "dir", "name");

CREATE UNIQUE INDEX "file_path" ON "file" ( "path" );

CREATE TABLE "ignore_path"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"disk" Integer NOT NULL,
	"path" Text NOT NULL );

CREATE UNIQUE INDEX "ignore_path_path" ON "ignore_path" ( "path" );

CREATE TABLE "scanning_path"(
	"id" Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"disk" Integer NOT NULL,
	"path" Text NOT NULL );

CREATE UNIQUE INDEX "scanning_path_disk_path" ON "scanning_path" ( "disk", "path" );
