# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# React Native
-keep,allowobfuscation,allowshrinking class com.facebook.react.** {
  *;
}

-keep,allowobfuscation,allowshrinking class com.facebook.hermes.** {
  *;
}

# Keep native methods
-keepclasseswithmembernames class * {
  native <methods>;
}

# Keep custom view constructors
-keepclasseswithmembers class * {
  public <init>(android.content.Context);
}

-keepclasseswithmembers class * {
  public <init>(android.content.Context, android.util.AttributeSet);
}

-keepclasseswithmembers class * {
  public <init>(android.content.Context, android.util.AttributeSet, int);
}

# Keep onclick handlers
-keepclassmembers class * extends android.app.Activity {
  public void *(android.view.View);
}
