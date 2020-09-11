const db = require('./database');


function getGallery(postId, type, userId) {
    const table = getTable(type);
    var sql = "SELECT GalleryID FROM "+table+" WHERE ID = ? AND UserID = ?;";
    const parameter = [postId, userId];
    const errorMessage = "Error getting gallery ID from database";
    return db.queryDb(sql, parameter, errorMessage);
}

function postImage(postId, imageUrl, newGallery, galleryId, type, userId) {
    const table = getTable(type);
    let gallerySql = "";
    let parameter = [imageUrl];
    if (newGallery) {
        gallerySql = "INSERT INTO WT_Gallery (GalleryID, ImageID) SELECT MAX(GalleryID)+1, @last_image_id FROM WT_Gallery;\
                    SET @last_gallery_id = LAST_INSERT_ID();\
                    UPDATE "+table+" SET GalleryID = (SELECT MAX(GalleryID) FROM WT_Gallery) WHERE ID = ? AND UserID = ?;";
                    parameter.push(postId);
                    parameter.push(userId);
    } else {
        gallerySql = "INSERT INTO WT_Gallery VALUES (?, @last_image_id);";
        parameter.push(galleryId);
    }
    var sql = "START TRANSACTION;\
            INSERT INTO WT_Image VALUES (NULL, ?);\
            SET @last_image_id = LAST_INSERT_ID();\
            "+gallerySql+"\
            COMMIT;";
    
    const errorMessage = "Error inserting image url into database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

function getImages(postId, userId, type) {
    const table = getTable(type);
    let sql = "SELECT WT_Image.ImageID, Url FROM WT_Image INNER JOIN WT_Gallery ON WT_Image.ImageID = WT_Gallery.ImageID \
                WHERE GalleryID = (SELECT GalleryID FROM "+table+" WHERE ID = ? AND UserID = ?)";
    let parameter = [postId, userId];
    const errorMessage = "Error getting images from database";
    return db.multiqueryDb(sql, parameter, errorMessage);
}

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