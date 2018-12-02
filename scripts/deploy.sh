#!/bin/bash

# Bail on errors
set -e

# Determine path to scripts/
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go one level up to the package directory
cd "$DIR/.."

# Read config
source deployment/config
if [[ -f deployment/.secrets ]]; then source deployment/.secrets; fi

# Upload to AWS S3
echo 'Uploading build to AWS S3 ...'
aws s3 cp \
  --recursive \
  --acl public-read \
  --exclude '*' \
  --include 'static/*' \
  --cache-control 'public, max-age=86400' \
  build \
  s3://$S3_BUCKET/
aws s3 cp \
  --recursive \
  --acl public-read \
  --exclude 'static/*' \
  --cache-control 'public, max-age=300' \
  build \
  s3://$S3_BUCKET/

# Build maxpurge command line for purging MaxCDN cache
args=''
if [[ -n $MAXCDN_ALIAS ]];  then args="$args -a ${MAXCDN_ALIAS}";  fi
if [[ -n $MAXCDN_TOKEN ]];  then args="$args -t ${MAXCDN_TOKEN}";  fi
if [[ -n $MAXCDN_SECRET ]]; then args="$args -s ${MAXCDN_SECRET}"; fi
if [[ -n $MAXCDN_ZONE ]];   then args="$args -z ${MAXCDN_ZONE}";   fi

# If MAXCDN_ZONE or maxpurge's own ZONE was set, purge cache
if [[ -n $MAXCDN_ZONE || -n $ZONE ]]; then
  echo 'Purging MaxCDN cache ...'
  maxpurge $args
else
  echo 'MaxCDN configuration unavailable, not purging'
fi

# All done
echo 'Deployment completed'
