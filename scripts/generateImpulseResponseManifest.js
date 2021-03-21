const {
  readdir,
  writeFile,
} = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'sounds', 'impulse-responses');
const writePath = path.join(__dirname, '..', 'impulse-response-manifest.js');

const getLicense = () => {
  return (
    `// Copyright 2018 Google Inc. All Rights Reserved.\n` +

    `// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at\n` +
    
    `// http://www.apache.org/licenses/LICENSE-2.0\n` +
    
    `// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.\n\n`
  );
};

readdir(dirPath, (err, filePathList) => {
  if (err) {
    throw new Error(err);
  }

  const manifest = {};
  filePathList.forEach((filePath, idx) => {
    const parsed = path.parse(filePath);
    if (parsed.ext === '.wav') {
      manifest[parsed.name] = path.relative(__dirname, path.join(dirPath, filePath)).replace(/\\/g, '/');
    }
  });

  writeFile(writePath, `${getLicense()}export default ${JSON.stringify(manifest, null, 2)}\n`, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
});
