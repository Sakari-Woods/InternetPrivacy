# The base image that we want to base the docker image from
# "node" image, "17" tag
FROM node:17

# Where all of the application's code goes (internal to docker itself)
# Where docker commands run out of 
WORKDIR /app

# Move the package list into the new app directory we just created
COPY package.json /app

# install the image's dependencies
RUN npm install

# Copy the project's source files over to the app directory
COPY . /app

# Start the server
CMD ["npm", "start"]


# Usage:

# Building an image:
# docker build  [-t option to select name of image] <name>
#               [. to indicate that file changes are to be made in the current directory]
#
# ex: docker build -t internet-privacy .

# To create a containter of the image:
# docker run    [--name option user selected name for the container (must be the name in example due to network dependencies)] <name>
#               [-it option for interactive-terminal upon execution]
#               [-d option to run the container in detached mode (in place of -it option)]
#               [-p option for mapping the internal docker port to an available external port] <extport>:<intport>
#               <image_name>
#
# ex: docker run --name priv-website -it -p 9000:80 internet-privacy
# ex: docker run --name priv-website -d -p 9000:80 internet-privacy

# To view the site, type in localhost:<extport> to your browser
