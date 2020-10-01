const db = require('./database');

/**
 * Query gets a gallery id for a given post
 * @param {*} postId 
 * @param {*} type 
 * @param {*} userId 
 */
function getGallery(postId, type, userId) {
    const table = getTable(type);
    var sql = "SELECT GalleryID FROM "+table+" WHERE ID = ? AND UserID = ?;";
    const parameter = [postId, userId];
    const errorMessage = "Error getting gallery ID from database";
    return db.queryDb(sql, parameter, errorMessage);
}

/**
 * Query posts a new image to a gallery. If newGallery true then creates a new gallery and links it to the post.
 * Otherwise inserts image for existing gallery.
 * @param {*} postId 
 * @param {*} imageUrl 
 * @param {*} newGallery 
 * @param {*} galleryId 
 * @param {*} type 
 * @param {*} userId 
 */
function postImage(postId, imageUrl, newGallery, galleryId, type, userId) {
    const table = getTable(type);
    let gallerySql = "";
    let parameter = [imageUrl];
    if (newGallery) {
        // creates a new gallery, incrementing max gallery value by for new unique id, then adds this to the post. 
        gallerySql = "INSERT INTO WT_Gallery (GalleryID, ImageID) SELECT MAX(GalleryID)+1, @last_image_id FROM WT_Gallery;\
                    SET @last_gallery_id = LAST_INSERT_ID();\
                    UPDATE "+table+" SET GalleryID = (SELECT MAX(GalleryID) FROM WT_Gallery) WHERE ID = ? AND UserID = ?;";
                    parameter.push(postId);
                    parameter.push(userId);
    } else {
        // adds the existing gallery id and new image id into gallery table
        gallerySql = "INSERT INTO WT_Gallery VALUES (?, @last_image_id);";
        parameter.push(galleryId);
    }
    // Inserts the image into image table
    var sql = "START TRANSACTION;\
            INSERT INTO WT_Image VALUES (NULL, ?);\
            SET @last_image_id = LAST_INSERT_ID();\
            "+gallerySql+"\
            COMMIT;";
    
    const errorMessage = "Error inserting image url into database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * Query gets images attached to a post
 * @param {*} postId 
 * @param {*} userId 
 * @param {*} type 
 */
function getImages(postId, userId, type) {
    const table = getTable(type);
    let sql = "SELECT WT_Image.ImageID, Url FROM WT_Image INNER JOIN WT_Gallery ON WT_Image.ImageID = WT_Gallery.ImageID \
                WHERE GalleryID = (SELECT GalleryID FROM "+table+" WHERE ID = ? AND UserID = ?)";
    let parameter = [postId, userId];
    const errorMessage = "Error getting images from database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

/**
 * Given a type, function returns a table name for the database
 * @param {*} type 
 */
function getTable(type) {
    if (type === "trip") {
        return "WT_TripPost";
    } else if (type === "leg") {
        return "WT_LegPost";
    } else {
        return "WT_ActivityPost";
    }
}

module.exports = {
    getGallery,
    postImage,
    getImages
}