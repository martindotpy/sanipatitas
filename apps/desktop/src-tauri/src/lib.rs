#[cfg(target_os = "windows")]
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "windows")]
            {
                let window = _app.get_webview_window("main").unwrap();
                setup_windows(&window);
            }

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "windows")]
fn setup_windows(window: &tauri::WebviewWindow) {
    window.set_decorations(false).unwrap();
}
