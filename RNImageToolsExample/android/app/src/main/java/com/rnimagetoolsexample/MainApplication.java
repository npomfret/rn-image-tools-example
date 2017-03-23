package com.rnimagetoolsexample;

import android.app.Application;
import android.support.multidex.MultiDex;

import com.adobe.creativesdk.foundation.AdobeCSDKFoundation;
import com.adobe.creativesdk.foundation.auth.IAdobeAuthClientCredentials;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.pomocorp.rnimagetools.RNImageToolsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, IAdobeAuthClientCredentials {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNImageToolsPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(getBaseContext());
        SoLoader.init(this, /* native exopackage */ false);

        AdobeCSDKFoundation.initializeCSDKFoundation(getApplicationContext());
    }

    @Override
    public String getClientID() {
        return getString(R.string.CSDK_CLIENT_ID);
    }

    @Override
    public String getClientSecret() {
        return getString(R.string.CSDK_CLIENT_SECRET);
    }

    @Override
    public String getRedirectURI() {
        return getString(R.string.CSDK_REDIRECT_URI);
    }

    @Override
    public String[] getAdditionalScopesList() {
        return new String[]{"email", "profile", "address"};
    }
}
