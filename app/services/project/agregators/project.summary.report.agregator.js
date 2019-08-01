export const ProjectAggregator = ({ project = {}, topic = {}, summary = {}, user = {}, report = {} }) =>
  [
    { $match: project }, //filter by Project
    {
      $lookup: {
        from: "tests",
        localField: "_id",
        foreignField: "project",
        as: "test"
      }
    },
    {
      $project: {
        test: "$test",
        project: {
          name: "$name",
          _id: "$_id",
          description: "$description",
          activity: "$activity"
        }
      }
    },
    { $unwind: { path: "$test" } },
    {
      $lookup: {
        from: "testcases",
        localField: "test._id",
        foreignField: "test",
        as: "testcase"
      }
    },
    { $unwind: { path: "$testcase" } },
    {
      $lookup: {
        from: "topics",
        localField: "testcase.topic",
        foreignField: "_id",
        as: "topic"
      },
    },
    { $unwind: { path: "$topic" } },
    { $match: topic }, // filter by topic
    {
      $lookup: {
        from: "summaries",
        localField: "testcase._id",
        foreignField: "test_case",
        as: "summary"
      },
    },
    { $unwind: { path: "$summary" } },
    { $match: summary }, // the match condition to filter by summary fields
    {
      $lookup: {
        from: "users",
        localField: "summary.user",
        foreignField: "_id",
        as: "user"
      },
    },
    { $unwind: { path: "$user" } },
    { $match: user }, // the match condition to filter by user
    {
      $group: {
        _id: "$user._id",
        id: { $first: "$user.id" },
        firstname: { $first: "$user.firstname" },
        lastname: { $first: "$user.lastname" },
        email: { $first: "$user.email" },
        description: { $first: "$user.description" },
        topics: { $addToSet: '$topic' },
        projects: { $addToSet: "$project" },
        test_cases: { $addToSet: '$testcase' },
        summaries: { $addToSet: "$summary" }
      }
    },
    {
      $addFields: {
        summaries: {
          $map: {
            input: "$summaries",
            as: "summary",
            in: {
              _id: "$$summary._id",
              test_case: "$$summary.test_case",
              approved: "$$summary.approved",
              createdAt: "$$summary.createdAt",
            }
          }
        },
      }
    },
    {
      $addFields: {
        test_cases: {
          $map: {
            input: "$test_cases",
            as: "testCase",
            in: {
              $mergeObjects: [
                {
                  summary_approved: {
                    $filter: {
                      input: "$summaries",
                      as: "summary",
                      cond: {
                        $and: [
                          { $eq: ["$$testCase._id", "$$summary.test_case"] },
                          { $eq: ["$$summary.approved", true] }
                        ]
                      }
                    }
                  },
                  summaries_not_approved: {
                    $filter: {
                      input: "$summaries",
                      as: "summary",
                      cond: {
                        $and: [
                          { $eq: ["$$testCase._id", "$$summary.test_case"] },
                          { $eq: ["$$summary.approved", false] }
                        ]
                      }
                    }
                  }
                },
                "$$testCase",
                { owner: undefined, code: undefined, timeout: undefined }
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        test_cases: {
          $map: {
            input: "$test_cases",
            as: "testCase",
            in: {
              $mergeObjects: [
                {
                  total_summaries: {
                    $add: [{ $size: "$$testCase.summary_approved" }, { $size: "$$testCase.summaries_not_approved" }]
                  },

                },
                {
                  is_solved: {
                    $gt: [{ $size: "$$testCase.summary_approved" }, 0]
                  }
                },
                "$$testCase"
              ]
            }
          },
        }
      }
    },
    {
      $addFields: {
        skills: {
          $map: {
            input: "$topics",
            as: "topic",
            in: {
              name: "$$topic.name",
              description: "$$topic.description",
              tests: {
                $filter: {
                  input: "$test_cases",
                  as: "testCase",
                  cond: { $in: ["$$topic._id", "$$testCase.topic"] }
                }
              },
            }
          },
        },
      },
    },
    {
      $addFields: {
        skills: {
          $map: {
            input: "$skills",
            as: "skill",
            in: {
              $mergeObjects: [
                {
                  info: {
                    $reduce: {
                      input: "$$skill.tests",
                      initialValue: { total: 0, approved: 0, not_approved: 0, summaries_to_approve: 0 },
                      in: {
                        total: { $sum: ["$$value.total", 1] },
                        summaries_to_approve: {
                          $sum: [
                            "$$value.summaries_to_approve",
                            {
                              $cond: {
                                if: { $eq: ['$$this.is_solved', true] },
                                then: "$$this.total_summaries",
                                else: 0
                              }
                            }
                          ]
                        },
                        approved: {
                          $sum: [
                            "$$value.approved",
                            {
                              $cond: {
                                if: { $eq: ['$$this.is_solved', true] },
                                then: 1,
                                else: 0
                              }
                            }
                          ]
                        },
                        not_approved: {
                          $sum: [
                            "$$value.not_approved",
                            {
                              $cond: {
                                if: { $eq: ['$$this.is_solved', false] },
                                then: 1,
                                else: 0
                              }
                            }
                          ]
                        },
                      }
                    }
                  }
                },
                "$$skill"
              ]
            }
          },
        },
      },
    },
    {
      $addFields: {
        skills: {
          $map: {
            input: "$skills",
            as: "skill",
            in: {
              $mergeObjects: [
                "$$skill",
                {
                  info: {
                    $mergeObjects: [
                      {
                        effort: "$$skill.info.summaries_to_approve"
                      },
                      {
                        negative_coefficent: {
                          $divide: [
                            { $sum: ["$$skill.info.total", 1] },
                            { $sum: ["$$skill.info.approved", 1] },
                          ]
                        }
                      },
                      "$$skill.info"
                    ]
                  }
                },

              ]
            }
          },
        },
      },
    },
    {
      $addFields: {
        skills: {
          $map: {
            input: "$skills",
            as: "skill",
            in: {
              $mergeObjects: [
                "$$skill",
                {
                  info: {
                    $mergeObjects: [
                      {
                        level: {
                          $multiply: [
                            {
                              $divide: [


                                "$$skill.info.approved",
                                { $multiply: ["$$skill.info.effort", "$$skill.info.negative_coefficent"] },
                              ]
                            },
                            100
                          ]
                        }
                      },
                      "$$skill.info",
                    ]
                  }
                },

              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        skill: {
          $avg: {
            $map: {
              input: "$skills",
              as: "skill",
              in: "$$skill.info.level"
            }
          }
        }
      }
    },
    {
      $match: report
    },
    {
      $project: {
        topics: 0,
        test_cases: 0,
        summaries: 0
      }
    }
  ]