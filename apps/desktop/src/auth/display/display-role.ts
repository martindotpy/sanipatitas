// Display
export function displayRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrador"
    case "veterinarian":
      return "Veterinario"
    case "worker":
      return "Trabajador"
    default:
      return role
  }
}
