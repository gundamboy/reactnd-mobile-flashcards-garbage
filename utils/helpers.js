import React from 'react';
import { AsyncStorage } from 'react-native';
import { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import {NOTIFICATION_KEY} from "./constants";


export function isBetween (num, x, y) {
    if (num >= x && num <= y) {
        return true;
    }

    return false;
}

export function timeToString (time = Date.now()) {
    const date = new Date(time);
    const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return todayUTC.toISOString().split('T')[0];
}

export function getDailyReminderValue () {
    return {
        today: "Don't forget to study today!"
    }
}

export function clearLocalNotification () {
    return AsyncStorage.removeItem(NOTIFICATION_KEY, () => {})
        .then(Notifications.cancelAllScheduledNotificationsAsync);
}

export function createNotification () {
    return {
        title: 'Study for you test',
        body: "Don't forget to take a quiz today.",
        ios: {
            sound: true
        },
        android: {
            sound: true,
            priority: 'high',
            sticky: false,
            vibrate: true
        }
    }
}

export function setLocalNotification () {
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if(data === null) {
                Permissions.askAsync(Permissions.NOTIFICATIONS)
                    .then(({ status }) => {
                        if (status === 'granted') {
                            Notifications.cancelAllScheduledNotificationsAsync().then();

                            let tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(20);
                            tomorrow.setMinutes(0);

                            Notifications.scheduleLocalNotificationAsync(
                                createNotification(),
                                {
                                    time: tomorrow,
                                    repeat: 'day',
                                }
                            ).then();

                            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true),  () => {});

                        }
                    })
            }
        });
}

export function generateDeckUID() {
    return (
        Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12)
    );
}