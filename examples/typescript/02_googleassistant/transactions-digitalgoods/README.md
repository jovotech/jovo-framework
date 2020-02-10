
### Digital Goods

#### Create Android App

- Create new empty Android Application in Android Studio 
- Add billing permission to AndroidManifest.xml
```
<uses-permission android:name="com.android.vending.BILLING" />
```

Here's the full file of the demo project.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="tech.jovo.transactionsdemo">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
    <uses-permission android:name="com.android.vending.BILLING" />
</manifest>
```

Build signed APK
https://developer.android.com/studio/publish/app-signing




