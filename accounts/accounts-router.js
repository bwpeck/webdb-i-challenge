const router = require('express').Router();

const db = require('../data/dbConfig.js');

router.get('/', (req, res) => {
  db('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'There was an error retrieving the account list, please try again' });
    });
});

router.get('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .first()
    .then(account => {
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ message: 'This account does not exist' });
      }
    });
});

router.post('/', (req, res) => {
  if (accountIsValid(req.body)) {
    db('accounts')
      .insert(req.body, 'id')
      .then(([id]) => id)
      .then(id => {
        db('accounts')
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json(account);
          });
      })
      .catch(() => {
        res.status(500).json({ message: 'This account can not be added at this time' });
      });
  } else {
    res.status(400).json({
      message: 'Please provide a name and budget greater than zero',
    });
  }
});

router.put('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count) {
        res.status(200).json({ message: `${count} The records have been successfully updated` });
      } else {
        res.status(404).json({ message: 'This account does not exist' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'This account cannot be updated at this time, please contact Administration for further assistance' });
    });
});

router.delete('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} File Deleted` });
    })
    .catch(() => {
      res.status(500).json({ message: 'This account could not be removed, please contact Administration for further assistance' });
    });
});

function accountIsValid({ name, budget }) {
  return name && typeof budget === 'number' && budget >= 0;
}

module.exports = router;