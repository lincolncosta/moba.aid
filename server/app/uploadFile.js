const azure = require("azure-storage");

const AZURE_CONTAINER_NAME = "images";
const AZURE_STORAGE_ACCOUNT_NAME = "mobatorstorage";
const AZURE_STORAGE_ACCOUNT_ACCESS_KEY = "NmAP6CEEMASkwqfpLybP5jBRqVaBFo6834VXC66D4bFUzfr42mUZnRwwY35xl39yFl86U/blUrBnmaEXMoc2tA==";

const fileservice = azure.createBlobService(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);

const uploadFile = blobName => {
  fileservice.createBlockBlobFromLocalFile(
    AZURE_CONTAINER_NAME,
    blobName,
    blobName,
    function(error, result, response) {
      if (!error) {
        // console.log("error: ", error);
      }
      // console.log("upload feito: ", result);
    }
  );
};

module.exports = uploadFile;
