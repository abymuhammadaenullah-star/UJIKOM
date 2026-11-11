const express = require('express');
const siswaController = require('../controllers/siswaController');

const router = express.Router();

router.get('/', siswaController.getAll);
router.get('/:kode_siswa', siswaController.getById);
router.post('/', siswaController.create);
router.put('/:kode_siswa', siswaController.update);
router.delete('/:kode_siswa', siswaController.remove);

module.exports = router;
