const { ObjectId } = require("mongodb");
const House = require("../models/house");
const Province = require("../models/province");
const District = require("../models/district");
const Ward = require("../models/ward");
const jwt = require("jsonwebtoken");

const houseCtrl = {
  getHouse: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        provinceId,
        districtId,
        wardId,
        name,
        state,
        fromPrice,
        toPrice,
        ownerId,
        lat,
        lng,
        radius,
      } = req.query;
      const skip = (page - 1) * limit;

      const query = {
        "information.state": { $ne: "deleted" },
      };

      if (provinceId) {
        query["address.province.sortId"] = parseInt(provinceId);
      }

      if (districtId) {
        query["address.district.sortId"] = parseInt(districtId);
      }

      if (wardId) {
        query["address.ward.sortId"] = parseInt(wardId);
      }

      if (state) {
        query["information.state"] = state;
      }

      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      if (fromPrice || toPrice) {
        query["information.prince.value"] = {};
        if (fromPrice) {
          query["information.prince.value"].$gte = parseInt(fromPrice);
        }
        if (toPrice) {
          query["information.prince.value"].$lte = parseInt(toPrice);
        }
      }

      if (ownerId) {
        query["owner"] = new ObjectId(ownerId);
      }

      if (lat && lng && radius) {
        query["address.location"] = {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng), parseFloat(lat)],
              parseFloat(radius) / 6378.1,
            ],
          },
        };
      }

      const data = await House.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      const count = await House.countDocuments();

      return res.json({
        data: data,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalResults: data.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const house = await House.findById(new ObjectId(id)).exec();
      if (house && house.information.state !== "deleted") {
        return res.status(200).json({
          data: house,
        });
      } else {
        return res.status(404).json({ msg: "not found" });
      }
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createHouse: async (req, res) => {
    try {
      const { name, image, address, information } = req.body;
      const token = getTokenBearer(req);
      const { id } = jwt.decode(token);
      const { location, provinceId, districtId, wardId, sortAddress } = address;

      const province = await Province.findOne({ sortId: provinceId });
      const district = await District.findOne({ sortId: districtId });
      const ward = await Ward.findOne({ sortId: wardId });

      const { prince, state, intro } = information;

      const newHouse = new House({
        name: name,
        image: image,
        owner: new ObjectId(id),
        address: {
          location: location,
          province: province && {
            sortId: province.sortId,
            name: province.name,
          },
          district: district && {
            sortId: district.sortId,
            name: district.name,
          },
          ward: ward && {
            sortId: ward.sortId,
            name: ward.name,
          },
          sortAddress: sortAddress,
        },
        information: {
          prince: prince,
          state: ["deposit", "hired", "ready"].includes(state) && state,
          intro: intro,
        },
      });

      const house = await newHouse.save();
      return res.json({
        data: house,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changeStateHouse: async (req, res) => {
    try {
      const { state, id } = req.params;
      if (!["deposit", "hired", "ready"].includes(state)) {
        return res.status(404).json({ msg: "state invalid" });
      }
      const house = await House.findById(new ObjectId(id)).exec();
      if (house && house.information.state !== "deleted") {
        const result = await house
          .updateOne({
            information: {
              ...house.information,
              state: state,
            },
          })
          .exec();
        return res.json({
          data: result,
        });
      } else {
        return res.status(404).json({ msg: "not found" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateHouse: async (req, res) => {
    try {
      const { id } = req.params;
      const house = await House.findById(new ObjectId(id)).exec();
      if (house && house.information.state !== "deleted") {
        const { address, information, name, image } = req.body;
        const { location, provinceId, districtId, wardId, sortAddress } =
          address;
        const province = await Province.findOne({ sortId: provinceId });
        const district = await District.findOne({ sortId: districtId });
        const ward = await Ward.findOne({ sortId: wardId });

        const { prince, intro } = information;

        const result = await house
          .updateOne({
            address: {
              location: location,
              province: province && {
                sortId: province.sortId,
                name: province.name,
              },
              district: district && {
                sortId: district.sortId,
                name: district.name,
              },
              ward: ward && {
                sortId: ward.sortId,
                name: ward.name,
              },
              sortAddress: sortAddress,
            },
            information: {
              prince: prince,
              state: house.information.state,
              intro: intro,
            },
            name: name,
            image: image,
          })
          .exec();
        return res.status(201).json({
          data: result,
        });
      } else {
        return res.status(404).json({ msg: "not found" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteHouse: async (req, res) => {
    try {
      const { id } = req.params;
      const house = await House.findById(new ObjectId(id)).exec();
      if (house && house.information.state !== "deleted") {
        await house.updateOne({
          information: {
            ...house.information,
            state: "deleted",
          },
        });
        res.status(201).json({ msg: "Deleted success" });
      } else {
        res.status(404).json({ msg: "not found" });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};
const getTokenBearer = (req) => {
  const token = req.header("Authorization").split(" ")[1];
  return token || "";
};

module.exports = houseCtrl;
