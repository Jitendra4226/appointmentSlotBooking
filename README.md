# Appointment Slot Booking

A React Native app for booking doctor appointments. Pick a doctor and a date, choose a free slot and book it. You can cancel or reschedule from My Appointments.

Built with React Native, TypeScript, Redux Toolkit (RTK Query) and axios. The API is mocked inside the app with axios-mock-adapter, so there's no separate server to run. Data is kept in memory and resets when the app restarts.

## Setup

You need a working React Native environment (Node 22+, JDK 17, Android Studio). If you don't have one yet, follow the [environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

```sh
git clone https://github.com/Jitendra4226/appointmentSlotBooking.git
cd appointmentSlotBooking
npm install
```

Run on Android:

```sh
npm start
npm run android   # in another terminal
```

Run on iOS:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

## APK

The APK is on the [Releases](https://github.com/Jitendra4226/appointmentSlotBooking/releases) page. To build it yourself:

```sh
cd android
./gradlew assembleRelease
```

It ends up in `android/app/build/outputs/apk/release/`.

## Booking conflict prevention

Logic is in `src/utils/bookingValidation.ts` and runs in the API on every book and reschedule.

- Past dates, breaks, leave and times outside working hours are rejected (400).
- A booking that overlaps an existing one for the same doctor is rejected (409).
- The same patient can't have two appointments at the same time, even with different doctors (409).
- Overlap check: `startA < endB && startB < endA`. Cancelled bookings are ignored.
- If two people book the same slot, the first one wins and the second gets a 409.
- Rescheduling uses the same checks and skips the appointment being moved. If it fails, the old slot is kept.
- After every change the appointments are refetched, so slots update right away.

