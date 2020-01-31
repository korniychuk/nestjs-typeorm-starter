import * as path from 'path';

export const rootDir = path.join.bind(path, path.resolve(path.join(__dirname, '..', '..')));
export const configDir = path.join.bind(path, __dirname);
export const parseEnvBoolean = (v: any) => v === 'true' || !!+v;
