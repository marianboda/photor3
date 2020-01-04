import sqlite from 'sqlite3';
import R from 'ramda';
import dayjs from 'dayjs';
import { DATE_FORMAT } from './utils.js';

const { without } = R;

const db = new sqlite.Database('./data/db.sqlite');

async function dbGet(query) {
    console.log('dbGet query', query);
    return new Promise((resolve, reject) => {
        db.all(query, (err, data) => {
            console.log('in promise', err, data);
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

async function dbSave(query, params) {
    console.log('dbSave query', query);
    return new Promise((resolve, reject) => {
        db.run(query, params, (err, data) => {
            console.log('in promise', err, data);
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

async function dbExec(query) {
    console.log('dbExec query', query);
    return new Promise((resolve, reject) => {
        db.exec(query, (err, data) => {
            console.log('in promise', err, data);
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

export const getScanningPaths = () => dbGet('SELECT * FROM scanning_path');
export const getUnscannedDir = async () => {
    const q = 'SELECT * FROM dir WHERE scanTime is NULL limit 1';
    const result = await dbGet(q);
    return result[0] || null;
};

const getSaveDirQuery = dir => {
    const keys = without(['isDir', 'dir', 'size'], Object.keys(dir));
    const vals = keys.map(key => `"${dir[key]}"`);
    return `INSERT OR IGNORE INTO dir (${keys.join(',')}) VALUES (${vals.join(',')})`;
};

const getSaveFileQuery = file => {
    const keys = without(['isDir'], Object.keys(file));
    const vals = keys.map(key => `"${file[key]}"`);
    return `INSERT OR IGNORE INTO file (${keys.join(',')}) VALUES (${vals.join(',')})`;
};

const getSaveQuery = files => {
    const getSaveOneQuery = f => (f.isDir ? getSaveDirQuery(f) : getSaveFileQuery(f));
    if (Array.isArray(files)) {
        return files.map(getSaveOneQuery).join(';\n');
    }
    return getSaveOneQuery(files);
};

export const save = async files => {
    console.log('------- SAVE QUERY -------------------');
    console.log(getSaveQuery(files));
    console.log('------- ---------- -------------------');
    const result = await dbExec(getSaveQuery(files));
    console.log(' - ', result);
    return result;
};

const getDirScanTimeUpdateQuery = path => {
    return `UPDATE dir SET scanTime='${dayjs().format(DATE_FORMAT)}' WHERE path='${path}'`;
};

export const updateDirScanTime = async path => {
    return dbSave(getDirScanTimeUpdateQuery(path));
};

export const saveScanningPath = async path => {
    return dbSave(`INSERT OR IGNORE INTO scanning_path (path) VALUES (?)`, [path]);
};

const getFilesQuery = () => 'SELECT * FROM file LIMIT 100';

export const getFiles = () => dbGet(getFilesQuery());
