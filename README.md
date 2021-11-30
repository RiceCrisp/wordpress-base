# README #

Walker Sands Base Wordpress Theme (ws)

### Local Setup ###
1. Install NPM/Node and Docker
2. In a terminal in the root of the application, run `docker-compose pull` to get the latest docker images.
3. Start the docker containers `docker-compose up -d`
    - If there are docker containers already running, then run the command `docker stop $(docker ps -aq) && docker container prune -f && docker network prune -f` first to kill all containers regardless of your location in the terminal. Save this command as an alias to save yourself time in the future.
4. Install dependencies `npm install`
5. Install WordPress and populate new install with placeholder data `sh init.sh "SITE_NAME" "USER_NAME" "EMAIL" "PASSWORD"`
6. Start the development task to start building files and watch for changes `npm run dev`
    - Site should now be available at *localhost*

#### Troubleshooting ####
- If you get an error that certain files are not known to Docker, confirm that your folder is listed as a directory or subdirectory of the "File Sharing" section of Docker preferences.
- If you get an error that ports are already being used, make sure your native apache and/or mysql is not running by using this command `sudo apachectl stop && sudo service mysqld stop`
- Make sure you don't have any overlapping Docker containers running. This can be checked with `docker ps`
- If you need to access the bash shell of the wordpress docker container, use command `docker exec -ti CONTAINER_NAME bash`
- If you want to change the project folder name, but don't want to lose any work that you've already done (because changing the project folder name will create new docker containers/volumes), use the command `docker-compose -p OLD_FOLDER_NAME up -d` to reference the old containers/volumes.
- To see the php error logs, use this command `docker logs -f CONTAINER_NAME >/dev/null`
- Do not run `docker prune`. It does not do what you think it does.

### Bitbucket & SSH Deployment Setup (WP Engine) ###
You can use Bitbucket Pipelines to build and deploy the theme when a new commit is pushed to the repository. If the site is hosted on WP Engine we can use rsync to transfer files.

1. Start a new project with a clone of the Walker Sands Base
    1. `git clone git@bitbucket.org:walkersandsdigital/walkersands_base_wp-theme.git FOLDER_NAME`
    2. `cd FOLDER_NAME`
    3. `rm -r .git`
    4. `git init`
2. Create new Bitbucket repo
    - Owner: Walker Sands Digital
    - Project: Clients
3. Setup Pipelines
    1. Enable Pipelines
    2. Generate SSH key
    3. Fetch and add the WP Engine SSH host name as a known host (ENV_NAME.ssh.wpengine.net)
    4. Update "Deployments" to these 3 environments: Development, Staging, Production
    5. Add the following secured repository variables to each deployment: SSH_USER, SSH_HOST
4. Add newly generated Bitbucket SSH public key to the WP Engine account (not to the "git push" options)
5. Make first commit to master
    1. `git add .`
    2. `git commit -m 'First commit'`
    3. `git remote add origin git@bitbucket.org:walkersandsdigital/REPO_NAME.git`
    4. `git push -u origin master`
6. Run pipeline in Bitbucket to deploy to WP Engine (may have to wait a couple minutes for WP Engine to add SSH key)

### Bitbucket & SFTP Deployment Setup ###
If the client is on a host other than WP Engine, try to setup the ssh/rsync first. If it is not available/possible, use this SFTP fallback.

1. Copy Walker Sands Base and start new project
    1. `git clone git@bitbucket.org:walkersandsdigital/walkersands_base_wp-theme.git FOLDER_NAME`
    2. `cd FOLDER_NAME`
    3. `rm -r .git`
    4. `git init`
2. Create new Bitbucket repo
    - Owner: Walker Sands Digital
    - Project: Clients
3. Setup Pipelines
    1. Enable Pipelines
    2. Fetch and add the SFTP hostname with port number as a known host (HOSTNAME:PORT)
    3. Update "Deployments" to these 3 environments: Development, Staging, Production
    4. Add the following secured repository variables to each deployment: SFTP_HOST, SFTP_PORT, SFTP_PATH, SFTP_USER, SFTP_PASSWORD
    5. Path should be the remote path to the ws theme directory. May have to create the ws folder first before deploying.
    6. Modify `bitbucket-pipelines.yml` to utilize the commented code correctly
4. Make first commit to master
    1. `git add .`
    2. `git commit -m 'First commit'`
    3. `git remote add origin git@bitbucket.org:walkersandsdigital/REPO_NAME.git`
    4. `git push -u origin master`
5. Run pipeline in Bitbucket to deploy to WP Engine (may have to wait a couple minutes for WP Engine to add SSH key)

### Github & SSH Deployment Setup ###
If the client requires the theme repository be GitHub, you can use these steps to setup GitHub Actions, which is the GitHub equivalent of Bitbucket Pipelines.

1. Start a new project with a clone of the Walker Sands Base
    1. `git clone git@bitbucket.org:walkersandsdigital/walkersands_base_wp-theme.git FOLDER_NAME`
    2. `cd FOLDER_NAME`
    3. `rm -r .git`
    4. `git init`
2. Generate a SSH key pair
    1. Run `ssh-keygen` and save the key pair. After we put both private and public keys into GitHub and WP Engine (respectively), you can delete the key pair from your machine.
3. Setup GitHub
    1. Create new GitHub repo
    2. Add the private key that we generated earlier as a secret named PRIVATE_KEY
    3. Add the following relevant secret variables: STAG_SSH_USER, STAG_SSH_HOST, PROD_SSH_USER, PROD_SSH_HOST
4. Add the public key that we generated earlier to the WP Engine account (not to the "git push" options)
5. Make first commit to master
    1. `git add .`
    2. `git commit -m 'First commit'`
    3. `git remote add origin git@github.com:REPO_NAME.git`
    4. `git push -u origin master`
6. Run the Action in GitHub to deploy to WP Engine (may have to wait a couple minutes for WP Engine to add SSH key)

### Creating New Blocks
For all of these steps, I would recommend either duplicating an existing block or at least referencing one when creating a new block.
1. Create a folder in the blocks directory.
2. Create a block.json file with appropriate fields.
3. Create an admin.tsx file with how the block should render in the editor.
4. Create a render.php file with how the block should render on the frontend.
5. Create a front.css and/or admin.css for styles. Ideally, the editor and frontend blocks should have the same structure, so we load front.css on both sides. However, if additional styles are needed for the editor, they can be included in the admin.css file. The admin.css file is optional.
6. If the block requires javascript functionality on the frontend, you can include a front.ts file. Both the front.ts and front.css file will only be loaded if the block is present on the page.
7. Add the export to /ws/blocks/index.ts
8. If your dev npm script is already running, you may need to restart it.

### Modifying Core Blocks
- To add styles to existing blocks, add a folder to the blocks directory with the name of the block, and then add a front.css file to that folder. Some are already included in the theme.
- To remove a core block, add it to the list in the theme.json file.

### Folder Structure
- assets: Static images and fonts used by the theme
- blocks: Theme's block library
- inc: PHP files that don't fit anywhere else
- languages: Multilingual files (not used)
- parts: Single views, archive views, and password protected page layout
- post-types: Register post types and any logic related to them
- src: All source JavaScript and CSS files
  - src/js/admin/components: Theme React component library
  - src/js/admin/filters: Filters for modifying core functionality
  - src/js/admin/formats: Inline text formats
  - src/js/admin/hooks: Custom React hooks
  - src/js/admin/options: JSX for option pages
  - src/js/admin/plugins: Modify core functionality sections (sidebar)
  - src/js/admin/stores: Custom Redux stores
  - src/js/admin/styles: Register and unregister core block styles
