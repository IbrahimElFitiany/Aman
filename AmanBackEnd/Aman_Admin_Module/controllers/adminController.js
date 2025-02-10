const {User , House , Room ,Governments,Employees, Furniture , Sensor , TheftLog , PoliceTracking} = require('../../Aman_User_Module/models/index')


const adminController = {
    listUsers: async (req, res) => {

        try {
            const users = await User.findAll();

            if (!users) {
                return res.status(404).json({ error: 'no users found' });
            }

            res.status(200).json({users});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    listHouses: async (req, res) => {

        try {
            const Houses = await House.findAll();

            if (!Houses) {
                return res.status(404).json({ error: 'no Houses found' });
            }

            res.status(200).json({Houses});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    listRooms: async (req, res) => {

        try {
            const rooms = await Room.findAll();

            if (!rooms) {
                return res.status(404).json({ error: 'no Rooms found' });
            }

            res.status(200).json({rooms});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    listGovs: async (req, res) =>{

    },
    addGov: async (req, res) => {
        let { govName } = req.body;
      
        if (!govName) {
          return res.status(400).json({ error: "Please provide the new government name." });
        }
        if(typeof govName !== 'string'){
            return res.status(400).json({ error: "Please provide a valid government name." });
        }

        try {
                  
            govName = govName.trim().replace(/\s+/g, '-').toLowerCase();

        
            const existingGov = await Governments.findOne({
                where: { gov_name: govName }
            });
        
            if (existingGov) {
                return res.status(400).json({
                error: "A government with this name already exists."
                });
            }
        
            try {
                const newGov = await Governments.create({
                gov_name: govName
                });
                res.status(201).json({ message: "Government created successfully." });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
      
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    },
    removeGov: async (req, res) =>{

    },
    listDist: async (req, res) =>{

    },
    addDist: async (req, res) =>{

    },
    removeDist: async (req, res) =>{

    },
    addEmp: async (req, res) => {
        const {fname,lname,ssn,role,username} = req.body;

        try {
            const newEmp = await Employees.create(
                
            )
            
        } catch (error) {
            
        }
        
    },
      

};

module.exports = adminController;
 