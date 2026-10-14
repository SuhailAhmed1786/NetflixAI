const Movie = require("../models/Movie.js")
const Scene = require("../models/Scene.js")
const {asyncHandler} = require('../utils/asyncHandler.js')

const listMovies = asyncHandler(async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page || "1", 10));
    const limit = Math.min(
        50,
        Math.max(1, Number.parseInt(req.query.limit || "12", 10))
    );

    const filter = { isPublished: true };

    if (req.query.genre) {
        filter.genres = req.query.genre;
    }

    if (req.query.search?.trim()) {
        filter.$text = { $search: req.query.search.trim() };
    }

    const [movies, total] = await Promise.all([
        Movie.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Movie.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        movies,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });

});

const createMovie = asyncHandler(async (req, res) => {
    const { title, videoUrl } = req.body;
    console.log("fdfdfdf", req.user._id)

    if (!title?.trim() || !videoUrl?.trim()) {
        res.status(400);
        throw new Error("Title and videoUrl are required.");
    }

    const movie = await Movie.create({
        ...req.body,
        title: title.trim(),
        videoUrl: videoUrl.trim(),
        createdBy: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Movie created successfully",
        movie,
    });

});

const createScene = asyncHandler(async (req, res) => {
    const { startTime, endTime, summary } = req.body;

    if (
        startTime === undefined ||
        endTime === undefined ||
        !summary?.trim()
    ) {
        res.status(400);
        throw new Error("startTime, endTime, and summary are required.");
    }

    if (
        !Number.isFinite(Number(startTime)) ||
        !Number.isFinite(Number(endTime)) ||
        Number(startTime) < 0 ||
        Number(endTime) <= Number(startTime)
    ) {
        res.status(400);
        throw new Error("Invalid scene timestamps.");
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        res.status(404);
        throw new Error("Movie not found.");
    }

    const scene = await Scene.create({
        movie: movie._id,
        startTime: Number(startTime),
        endTime: Number(endTime),
        summary: summary.trim(),
        characters: req.body.characters || [],
        dialogueSummary: req.body.dialogueSummary || "",
        trivia: req.body.trivia || [],
    });

    res.status(201).json({
        success: true,
        message: "Scene created successfully",
        scene,
    });
});

const getSceneAtTimestamp = asyncHandler(async (req, res) => {  
    const timestamp = Number(req.query.t);
      console.log("myrequestss", timestamp)
    if (!Number.isFinite(timestamp) || timestamp < 0) {
        res.status(400);
        throw new Error("Provide a valid non-negative timestamp in seconds.");
    }

    const movie = await Movie.findById(req.params.id);
    console.log(req.params.id);
    

    if (!movie) {
        res.status(404);
        throw new Error("Movie not found.");
    }

    const scene = await Scene.findOne({
        movie: movie._id,
        startTime: { $lte: timestamp },
        endTime: { $gt: timestamp },
    }).sort({ startTime: -1 });

    res.status(200).json({
        success: true,
        scene,
    });

});

module.exports = {
    listMovies,
    createMovie,
    createScene,
    getSceneAtTimestamp
};