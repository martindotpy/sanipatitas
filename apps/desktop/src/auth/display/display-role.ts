// Display
export function displayRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrador"
    case "user":
      return "Usuario"
    default:
      return role
  }
}
