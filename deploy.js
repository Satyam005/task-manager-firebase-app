const { execSync } = require("child_process");

const deploy = () => {
  try {
    // Build the Next.js application
    console.log("Building the Next.js application...");
    execSync("npx netlify link", { stdio: "inherit" });

    // Deploy to Netlify
    console.log("Deploying to Netlify...");
    execSync("npx netlify deploy --build --prod", {
      stdio: "inherit",
    });

    // Open the deployed site to get the URL
    console.log("Opening deployed site to get the URL...");
    execSync("npx netlify open --site");

    console.log("Deployment complete.");
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};

deploy();
