const Province = require("../models/province");
const District = require("../models/district");
const Ward = require("../models/ward");

const areaCtrl = {
  getProvince: async (req, res) => {
    try {
      const provinces = await Province.find();
      return res.json({ provinces: provinces });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDistrict: async (req, res) => {
    try {
      const { provinceId } = req.params;
      const districts = await District.find({ provinceId });
      return res.json({ districts: districts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getWard: async (req, res) => {
    try {
      const { districtId } = req.params;
      const wards = await Ward.find({ districtId });
      return res.json({ wards: wards });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = areaCtrl;
