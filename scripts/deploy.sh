#!/bin/bash

# Bail on errors
set -e

# Determine path to scripts/
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go one level up to the package directory
cd "$DIR/.."

# Read config
source .deployment

# Upload to AWS S3
echo 'Uploading build to AWS S3 ...'
aws s3 cp --recursive --acl public-read --cache-control 'public, max-age=300' build s3://$S3_BUCKET/

# Build maxpurge command line for purging MaxCDN cache
args=''
[[ -n $MAXCDN_ALIAS ]] && args="$args -a ${MAXCDN_ALIAS}"
[[ -n $MAXCDN_TOKEN ]] && args="$args -t ${MAXCDN_TOKEN}"
[[ -n $MAXCDN_SECRET ]] && args="$args -s ${MAXCDN_SECRET}"
[[ -n $MAXCDN_ZONE ]] && args="$args -z ${MAXCDN_ZONE}"

# If MAXCDN_ZONE or maxpurge's own ZONE was set, purge cache
if [[ -n $MAXCDN_ZONE || -n $ZONE ]]; then
  echo 'Purging MaxCDN cache ...'
  maxpurge $args
else
  echo 'MaxCDN configuration unavailable, not purging'
fi

# All done
echo 'Deployment completed'
