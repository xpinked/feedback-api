const FeedBack = require('../Models/feedbackModel');

exports.getRoadmap = async (req, res) => {
  try {
    const feedback = await FeedBack.aggregate([
      { $match: { status: { $ne: 'suggestion' } } },
      { $match: { status: { $ne: 'test' } } },
      { $sort: { _id: -1 } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          feedbacks: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          description: {
            $cond: {
              if: { $eq: ['$_id', 'planned'] },
              then: 'Ideas prioritized for research',
              else: {
                $cond: {
                  if: { $eq: ['$_id', 'in-progress'] },
                  then: 'Currently being developed',
                  else: {
                    $cond: {
                      if: { $eq: ['$_id', 'live'] },
                      then: 'Released features',
                      else: 'test',
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: feedback,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
