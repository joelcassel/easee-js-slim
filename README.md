# Slim API abstraction for Easee EV charging stations

- Handy command abstraction and simple examples
- Uses **Axios** for access.
- You need an account created on Easee Cloud (https://easee.cloud/auth/signup)
- Details on the Easee API is on https://developer.easee.cloud/docs/get-started

# Quickstart

## For single installations for the Easee EV charger

Easee chargers can be installed in very advanced enterprise systems. This is powerful but also makes the API harder to work with.

Most normal home-automation enthusiasts have only one charger, for this case there is a quick-start available. This will query your chain of settings and IDs that are static and unchangeable for you:
`ChargerId` -> `SiteId` -> `CircuitId`

Simplest way:

1. Register your account and charger in the "Easee" app, or at https://easee.cloud/auth/signup.
1. Set the your Easee account `username` and `password` as environment variables:
   ```bash
   Linux:
       export EASEE_USERNAME=youremal@domain.com
       export EASEE_PASSWORD=Password123
   Windows:
       set EASEE_USERNAME=youremal@domain.com
       set EASEE_PASSWORD=Password123
   ```
1. Run `npm run printEaseeDetails`... This will log in and print the nested details. It will print a lot of details and summarize with your IDs example:

   ```
        ..
        ....
        It seems you have only one charger and setup.
        For convenience you can then pre-set all as env-variables and the API will use the default.

        export EASEE_CHARGERID='EH2AABCD'
        export EASEE_SITEID='1234567'
        export EASEE_CIRCUITID='123456'
        export EASEE_DEBUG=false
   ```
