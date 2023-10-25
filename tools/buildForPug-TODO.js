/* 
This should be used as a post-build step after parcel has built the client to add pug files 
back to the distribution folder and update them with proper script tags that refer to compiled ts modules.

1. First figure out which script ts files need to be updated and where parcel put their compiles versions in the .dist folder.
2. Repace in pug file (e.g., with a grep file search/replace lib) the references to the ts scripts by 
their compiled pathnames in the .dist folder. 
3. Copy pug file to the proper folder in ./dist.

This way pug files can be referred to in the server code and be rendered dynamically! 
*/
