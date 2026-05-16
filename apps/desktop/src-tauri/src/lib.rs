#[cfg(windows)]
use tauri::Manager;
use tauri_plugin_frame::FramePluginBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(windows)]
            {
                let window = _app.get_webview_window("main").unwrap();
                setup_windows(&window);
            }

            Ok(())
        })
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(FramePluginBuilder::new().auto_titlebar(true).build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(windows)]
fn setup_windows(window: &tauri::WebviewWindow) {
    window.set_decorations(false).unwrap();
}
