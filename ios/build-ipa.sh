#!/bin/bash

echo "Building iOS IPA..."
echo.

# 检查是否在正确的目录
if [ ! -d "ReminderApp.xcodeproj" ] && [ ! -d "ReminderApp.xcworkspace" ]; then
    echo "Error: Please run this script from the ios directory"
    exit 1
fi

# 使用Xcode构建
echo "Building Release IPA..."

# 如果存在workspace,使用workspace
if [ -d "ReminderApp.xcworkspace" ]; then
    xcodebuild -workspace ReminderApp.xcworkspace \
        -scheme ReminderApp \
        -configuration Release \
        -archivePath build/ReminderApp.xcarchive \
        archive

    if [ $? -eq 0 ]; then
        echo "Archive created successfully!"

        # 导出IPA
        echo "Exporting IPA..."
        xcodebuild -exportArchive \
            -archivePath build/ReminderApp.xcarchive \
            -exportPath build/export \
            -exportOptionsPlist ExportOptions.plist

        if [ $? -eq 0 ]; then
            echo ""
            echo "========================================"
            echo "IPA build completed successfully!"
            echo "========================================"
            echo ""
            echo "IPA location: ios/build/export/ReminderApp.ipa"
            echo ""
        else
            echo "Error: Failed to export IPA"
            exit 1
        fi
    else
        echo "Error: Failed to create archive"
        exit 1
    fi
else
    echo "Error: ReminderApp.xcworkspace not found. Please run 'pod install' first."
    exit 1
fi
