#!/bin/bash


# Navigate to the script's directory
cd "$(dirname "$0")"



# Run yo command with predefined options using echo for each input
{
  echo 3
  sleep 5
  echo 4
  sleep 5
  echo 1
  sleep 5
  echo 1
  sleep 5
  echo Field
  sleep 5
  echo "none"
  sleep 5


  echo project3
  sleep 5
  echo "App Title"
  sleep 5
  echo tt
  sleep 5
  echo "An SAP Fiori application."
  sleep 5
  echo
  sleep 5
  echo
  sleep 5
  echo "1.122.2 - (Maintained version)"
  sleep 5
  echo N
  sleep 5
  echo N
  sleep 5
  echo N
} | yo @sap/fiori --skip-install --skip-cache --no-interaction --force || true