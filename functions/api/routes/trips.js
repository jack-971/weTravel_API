const express = require('express');
const router = express.Router();

const trips = require('../../database/tripsData');
const notification = require('../../database/notificationData');
const fcm = require('../middleware/pushNotification');

/**
 * Gets a list of trips for a given user for the given status (planned, active, complete).
 */
router.get('/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const status = req.query.status;
    let post = false;
    if (status === "complete") {
        post = true;
    }
    try {
            const data = await trips.getUsersTrips(id, status, post);
            console.log(data); // sends an error if there is no current trip.
            if (status === 'active') {
                tripId = data[0].ID;
                const trip = await trips.getUsersTrips(id, status, true);
                const users = await trips.getTripUsers(tripId);
                const legs = await trips.getTripLegs(tripId, id, true);
                const activities = await trips.getLegActivities(tripId, id, true);
                res.status(200).json({"trip":trip, "users": users, "legs": legs, "activities": activities});
                //res.status(200).json({"trip":trip});
            } else {
                res.status(200).json({data});
            }
            
    } catch (err) {
        return next(err);
    }
});

/**
 * Gets a trips details given the user id and trip id.
 */
router.get('/trip/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const tripId = req.query.trip;
    const status = req.query.status;
    console.log(tripId);
    let post = false;
    if (status !== "planned") {
        post = true;
    }
    try {
        const trip = await trips.getTrip(tripId, userId);
        const users = await trips.getTripUsers(tripId);
        const legs = await trips.getTripLegs(tripId, userId, post);
        const activities = await trips.getLegActivities(tripId, userId, post);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({"trip": trip, "users": users, "legs": legs, "activities": activities});
    } catch (err) {
        return next(err);
    }
});
/*
router.get('/active/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    try {
        const data = await trips.getActiveTrip(userId);
        tripId = data[0].TripID;
        const users = await trips.getTripUsers(tripId);
        const legs = await trips.getTripLegs(tripId, userId);
        const activities = await trips.getLegActivities(tripId, userId);
        //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
        res.status(200).json({"users": users, "legs": legs, "activities": activities});
    } catch (err) {
        return next(err);
    }
});
*/
/**
 * Updates details for an entry. Determines whether updates should be to an entry or an entry post.
 */
router.patch('/trip/:id', async(req, res, next) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const type = req.body.type;
    const status = req.body.status;
    try {
        if (type === 'trip') {
            if (status === 'planned') {
                console.log(status);
                await trips.patchTrip(updates);
            } else {
                await trips.patchTripPost(id, updates);
            }
        } else if (type === 'leg') {
            if (status === 'planned') {
                await trips.patchLeg(updates);
            } else {
                await trips.patchLegPost(id, updates);
            }
        } else {
            if (type  === 'planned') {
                await trips.patchActivity(updates);
            } else {
                await trips.patchActivityPost(id, updates);
            } 
        }
        res.status(200).json({"message": "success"});
    } catch (err) {
        return next(err);
    }
});

/**
 * Creates a new trip - entries in the tripuser table and trip details table. Also creates a default leg which has the info taken from
 * the trip and links the leg to the trip. Accomodates for creation of leg and activity posts as well.
 */
router.post('/trip/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const data = req.body;
    const type = req.body.type;
    const status = req.body.status;
    console.log(status);
    try {
        let response = "";
        if (type === 'trip') {
            response = await trips.postTrip(userId, data);
            data.trip = response[5][0].ID;
            const leg = await trips.postLeg(userId, data);
            res.status(200).json({data: response[5], leg: leg[5]});
        } else if (type === 'leg') {
            if (status === 'planned') {
                response = await trips.postLeg(userId, data);
                console.log("here now");
            } else {
                response = await trips.postLeg(userId, data);
                console.log("here");
                console.log(response);
                // get leg id from posted leg.
                legId = response[5][0].ID;
                console.log(legId);
                await trips.postLegPost(userId, legId, data);
            }
            res.status(200).json({data: response[5]});
        } else {
            if (status === 'planned') {
                response = await trips.postActivity(userId, data);
            } else {
                response = await trips.postActivity(userId, data);
                // get activity id fromt posted activity
                activityId = response[5][0].ID;
                await trips.postActivityPost(userId, activityId, data);
            }
            res.status(200).json({data: response[5]});
        }

    } catch (err) {
        return next(err);
    }
});

/**
 * Adds a user to a trip
 */
router.post('/trip/user/:id', async(req, res, next) => {
 const id = parseInt(req.params.id);
 const values = req.body;
 try {

    //post notification
     if (values.type === 'trip') {
        const keys = await notification.getKeys([values.user]);
        console.log("key is "+keys[0]);
        if(keys[0]!= undefined) {
            const key = keys[0].NotificationKey;
            fcm.sendNotification(key, "trip_added");
        }
        notification.postNotification(values.user, "trip_added", null, id, values.time);
        await trips.addTripUser(values.user, id);
     } else if(values.type === 'leg') {
        await trips.addLegUser(parseInt(values.user), id, parseInt(values.tripId));
     } else {
        await trips.addActivityUser(values.user, id, parseInt(values.legId));
     }
    //res.set('Cache-Control', 'public, max-age=300, s-maxage=600'); // remove caching to a method so it is easily updated and only used when wanted.
    res.status(200).json({"message": "success"});
    } catch (err) {
        return next(err);
    }
});

/**
 * Deletes a user from a an itinerary item (trip, leg or activity) and any other associated items.
 * If a trip removes from trip, legs and activities. If a leg removes leg and activities. If an activity removes from activity.
 */
router.delete('/leave/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const id = parseInt(req.query.id);
    const type = req.query.type;
    try {
        if (type === 'trip') {
            console.log("about to await trip");
            await trips.removeTripUser(userId, id);
        } else if (type === 'leg') {
            await trips.removeLegUser(userId, id);
        } else {
            await trips.removeActivityUser(userId, id);
        }
        res.status(200).json({message: "user removed from trip"});
    } catch(err) {
        return next(err);
    }
});

/**
 * Send request to update a status of a trip for a given user. Determines whether trip is active or complete. If active method will 
 * also send a complete trip request for any currently active trips to prevent there being more than one active trip.
 */
router.patch('/status/:id', async(req, res, next) => {
    const userId = parseInt(req.params.id);
    const tripId = parseInt(req.body.trip);
    const statusId = parseInt(req.body.status); // default to planned status
    try {
        if (statusId === 2) {
            // change status of any currently active trip to complete
            await trips.patchTripComplete(userId);
            // change the status
            await trips.patchTripActive(userId, tripId); 
            // Get all the entries associated with the trip.
            let [trip, legs, activities] = await Promise.all([trips.getUsersTrips(userId, 'active', false), trips.getTripLegs(tripId, userId, false), 
                    trips.getLegActivities(tripId, userId, false)])
            // extract the trip, legs array & activities array from JSON response.
            const tripDetails = trip[0];
            await trips.postTripPost(userId, tripId, tripDetails); // post trip data into table.
            // for leg & activity array, check if is attached to the user and if so post that entries details into appropriate table.
            for (loop = 0; loop<legs.length; loop++) {
                if (legs[loop].UserID === userId) {
                    trips.postLegPost(userId, legs[loop].LegID, legs[loop]);
                }
            }
            for (loop = 0; loop<activities.length; loop++) {
                if (activities[loop].ActivityUserID === userId) {
                    trips.postActivityPost(userId, activities[loop].ActivityID, activities[loop]);
                }
            }
        } else {
            await trips.patchTripComplete(userId);
        }
        res.status(200).json({"message": "success"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
