const WatchParty = require("../models/WatchParty.js")
const { generatePartyCode } = require("../utils/generatePartyCode.js")
const {asyncHandler} = require('../utils/asyncHandler.js')
const Movie = require("../models/Movie.js")
const Message = require("../models/Message.js")

const createParty = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  console.log("madihasss", movieId)

  if (!movieId) {
    res.status(400);
    throw new Error("movieId is required.");
  }

  const movie = await Movie.findOne({
    _id: movieId,
    isPublished: true,
  });

  if (!movie) {
    res.status(404);
    throw new Error("Published movie not found.");
  }

  const party = await WatchParty.create({
    code: generatePartyCode(),
    host: movie._id,
    movie: movie._id,
    participants: [movie._id],
    status: "ACTIVE",
    playback: {
      currentTime: 0,
      isPlaying: false,
      updatedAt: new Date(),
    },
  });

  const populatedParty = await party.populate([
    { path: "host", select: "name email" },
    { path: "movie", select: "title videoUrl thumbnailUrl durationSeconds" },
    { path: "participants", select: "name" },
  ]);

  res.status(201).json({
    success: true,
    message: "Watch party created successfully",
    party: populatedParty,
  });

});

const joinParty = asyncHandler(async (req, res) => {
  const code = req.params.code.trim().toUpperCase();

  const party = await WatchParty.findOne({
    code,
    status: "ACTIVE",
  });

  if (!party) {
    res.status(404);
    throw new Error("Active watch party not found.");
  }

  await WatchParty.updateOne(
    { _id: party._id },
    { $addToSet: { participants: party._id } }
  );

  const updatedParty = await WatchParty.findById(party._id).populate([
    { path: "host", select: "name" },
    { path: "movie", select: "title videoUrl thumbnailUrl durationSeconds" },
    { path: "participants", select: "name" },
  ]);

  res.status(200).json({
    success: true,
    message: "Joined watch party successfully",
    party: updatedParty,
  });

});

const getParty = asyncHandler(async (req, res) => {
  const party = await WatchParty.findById(req.params.id).populate([
    { path: "host", select: "name" },
    { path: "movie", select: "title description videoUrl thumbnailUrl durationSeconds" },
    { path: "participants", select: "name" },
  ]);
  if (!party) {
    console.log("partyss", party)
    res.status(404);
    throw new Error("Watch party not found.");
  }

  const isMember = party.participants.some((participant) => participant._id.equals(req.user._id));
  // if (!isMember) {
  //   res.status(403);
  //   throw new Error("Join this party before viewing its details.");
  // }
  res.status(200).json({
    success: true,
    party,
  });
});


const leaveParty = asyncHandler(async (req, res) => {
  const party = await WatchParty.findById(req.params.id);

  if (!party) {
    res.status(404);
    throw new Error("Watch party not found.");
  }

  const isHost = party.host.equals(req.user._id);
  const isMember = party.participants.some(
    (participantId) => participantId.equals(req.user._id)
  );

  if (!isMember) {
    res.status(403);
    throw new Error("You are not a member of this party.");
  }

  if (party.status === "ENDED") {
    res.status(400);
    throw new Error("This party has already ended.");
  }

  if (isHost) {
    party.status = "ENDED";
  } else {
    party.participants = party.participants.filter(
      (participantId) => !participantId.equals(req.user._id)
    );
  }

  await party.save();

  res.status(200).json({
    success: true,
    message: isHost
      ? "Watch party ended successfully."
      : "You left the watch party.",
  });

});


const getPartyMessages = asyncHandler(async (req, res) => {
  const party = await WatchParty.findById(req.params.id)
    .select("participants");

  if (!party) {
    res.status(404);
    throw new Error("Watch party not found.");
  }

  const isMember = party.participants.some(
    (participantId) => participantId.equals(req.user._id)
  );

  // if (!isMember) {
  //   res.status(403);
  //   throw new Error("Join this party to view messages.");
  // }

  const messages = await Message.find({
    party: party._id,
  })
    .populate("sender", "name")
    .sort({ createdAt: 1 })
    .limit(200);

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});

module.exports = {
  createParty,
  joinParty,
  getParty,
  leaveParty,
  getPartyMessages,
};