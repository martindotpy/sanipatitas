use std::time::Duration;
use tauri::Manager;
use tauri_plugin_frame::FramePluginBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    builder = builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(FramePluginBuilder::new().auto_titlebar(true).build())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(windows)]
            {
                setup_windows(&window);
            }

            #[cfg(any(windows, target_os = "linux"))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;

                app.deep_link().register("sanipatitas")?;
            }

            tauri::async_runtime::spawn(async move {
                tokio::time::sleep(Duration::from_millis(5000)).await;
                window.show().unwrap();
            });

            Ok(())
        });

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(windows)]
fn setup_windows(window: &tauri::WebviewWindow) {
    window.set_decorations(false).unwrap();
}
