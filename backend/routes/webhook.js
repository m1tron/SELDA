const express = require("express");
const router = express.Router();
const path = require("path");
const { exec } = require("child_process");

// Get the absolute path to the deployment script 
const deployScriptFrontend = path.join(__dirname, "../webhook_frontend.bat");
const deployScriptBackend = path.join(__dirname, "../webhook_backend.bat");

// For this continuous deployment endpoint to work, a webhook must be configured using bitbucket (could be adapted to github)
router.post("/webhook", (req, res) => {
    console.log("Received webhook:"); 

    const script = req.body.repository.name == "frontend" ? deployScriptFrontend : deployScriptBackend;
    console.log(`<><><> USING SCRIPT: ${script}`);
    
    // Run deployment script (relative path)
    exec(`"${script}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).send("Deployment failed");
        }
        console.log(`Deployment output: ${stdout}`);
        res.status(200).send("Deployment successful");
    });
});

module.exports = router;