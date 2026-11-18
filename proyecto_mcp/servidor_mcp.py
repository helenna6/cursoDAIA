from mcp.server.mcpserver import MCPServer

# 1. Creamos la instancia usando el nuevo nombre de la clase
mcp = MCPServer("Servidor Educativo de Matemáticas")

# 2. Definimos la herramienta exactamente igual
@mcp.tool()
def calcular_area_rectangulo(base: float, altura: float) -> str:
	"""
	Calcula el area de un rectangulo dadas su base y su altura
	"""
	area = base * altura
	return f"[CODIGO LOCAL EJECUTADO] El area calculada por mi script es {area}."


# 3. Arrancamos el servidor
if __name__ == "__main__":
	mcp.run(transport="stdio")
