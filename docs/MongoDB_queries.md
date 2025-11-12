# PARTIE 1
>## P1Q1 :Comptez le nombre de documents de la base de données.
>```
>//Mongodb command
>db.rentals.aggregate([
>    {
>    $count: "total_listings
>    }
> ])
>```

>## P1Q2 : Comptez le nombre de documents de la base de données.
>```
>//Mongodb command
>db.rentals.aggregate([
>  {
>    $match:
>      {
>        instant_bookable: true
>      }
>  },
>  {
>    $group:
>      {
>        _id: "instant_bookable",
>        count: {$sum: 1}
>      }
>  }
>])
>```

# PARTIE 2 
>## P2S1Q1 : Combien d’annonces y a-t-il par type de location ?
>```
>//Mongodb command
>db.rentals.aggregate([
>  { $group: { _id: "$property_type", count: { $sum: 1 } } },
>  { $sort : {count:-1}}
>])
>```

>## P2S1Q2 : Quelles sont les 5 annonces de location avec le plus d’évaluations ? Et combien d’évaluations ont-elles ?
>```
>db.rentals.aggregate([{
>    $project:
>      {
>        name: 1,
>        number_of_reviews: 1
>      }
>  },
>  {
>    $sort:
>      {
>        number_of_reviews: -1
>      }
>  },
>  {
>    $limit:
>      5
>  }])
>```

>## P2S1Q3 Quel est le nombre total d’hôtes différents ?
>```
>db.rentals.aggregate([
>  {$group: {_id: "$host_id"}},
>  {$count: "numberOfHost_id"}
>])
>```

>## P2S1Q4 : Quel est le nombre de locations réservables instantanément ? Cela représente quelle proportion des annonces ? 
>```
>[
>  {
>    $facet: {
>      totalCount: [
>        {
>          $count: "total"
>        }
>      ],
>      filteredCount: [
>        {
>          $match: {
>            instant_bookable: true
>          }
>        },
>        {
>          $count: "bookable"
>        }
>      ]
>    }
>  },
>  {
>    $project: {
>      total: {
>        $arrayElemAt: ["$totalCount.total", 0]
>      },
>      bookable: {
>        $arrayElemAt: [
>          "$filteredCount.bookable",
>          0
>        ]
>      },
>      ratio: {
>        $round: [
>          {
>            $multiply: [
>              {
>                $divide: [
>                  {
>                    $arrayElemAt: ["$filteredCount.bookable", 0,]
>                  },
>                  {
>                    $arrayElemAt: ["$totalCount.total", 0]
>                  }
>                ]
>              },
>              100
>            ]
>          },
>          2
>        ]
>      }
>    }
>  }
>]
>```

>## P2S1Q5 Est-ce que des hôtes ont plus de 100 annonces sur les plateformes ? Et si oui qui sont-ils ? Cela représente quel pourcentage des hôtes ?
>```
>[
>  {
>    $group: {
>      _id: "$host_id",
>      count: {
>        $sum: 1
>      }
>    }
>  },
>  {
>    $facet: {
>      hostsList: [
>        {
>          $match: { count: { $gt: 100 }}
>        },
>        {
>          $sort: { count: -1 }
>        }
>      ],
>      stats: [
>        {
>          $group: {
>            _id: null,
>            hostsWithMoreThan100: {
>              $sum: {
>                $cond: [{ $gt: ["$count", 100] }, 1, 0]
>              }
>            },
>            totalHosts: { $sum: 1 }
>          }
>        },
>        {
>          $project : {
>            totalHosts : 1,
>            hostsWithMoreThan100 : 1,
>            percentage: { $round : [
>              {$multiply: [{ $divide: ["$hostsWithMoreThan100", "$totalHosts"] }, 100]},2] }
>          }
>        }
>      ]
>    }
>  }
>]
>```

>## P2S1Q6 Combien y a-t-il de super hôtes différents ? Cela représente quel pourcentage des >hôtes ?
>```
>[
>  {
>    $group:
>      {
>        _id: "$host_id",
>        his: { $first: "$host_is_superhost" }
>      }
>  },
>  {
>    $facet: {
>      total: [
>        {
>          $count: "total"
>        }
>      ],
>      filter: [
>        {
>          $match: { his: true }
>        },
>        {
>          $count: "superhost"
>        }
>      ]
>    }
>  },
>  {
>    $project:
>      {
>        superhost: {
>          $arrayElemAt: ["$total.total", 0]
>        },
>        totalhost: {
>          $arrayElemAt: ["$filter.superhost", 0]
>        },
>        ratio: {
>          $round: [
>            {
>              $multiply: [
>                {
>                  $divide: [
>                    { $arrayElemAt: ["$filter.superhost", 0 ] },
>                    { $arrayElemAt: [ "$total.total", 0 ] }
>                  ]
>                },
>                100
>              ]
>            },
>            2
>          ]
>        }
>      }
>  }
>]
>```