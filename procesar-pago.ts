/// Tipos de datos soportados para el procesamiento de pagos

export type MethodoPago =
  | "tarjeta"
  | "transferencia"
  | "billetera"
  | "efectivo";

export interface DatosPago {
  idUsuario: string;
  monto: number;
  methodoPago: MethodoPago;
  moneda?: string;
  referencia?: string;
}

export interface ResultadoPago {
  exitoso: boolean;
  idTransaccion?: string;
  mensaje: string;
  fecha?: string;
}

export interface EstadoCuenta {
  saldoDisponible: number;
  montoMinimo: number;
  montoMaximo: number;
}

/// Errores posibles durante el procesamiento

export class ErrorValidacionPago extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErrorValidacionPago";
  }
}

export class ErrorProcesamientoPago extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErrorProcesamientoPago";
  }
}

/// Valida que los datos de pago cumplan con los requisitos的基本

function validarDatosPago(datos: DatosPago): void {
  if (!datos.idUsuario || typeof datos.idUsuario !== "string") {
    throw new ErrorValidacionPago("El ID de usuario es obligatorio y debe ser una cadena");
  }

  if (typeof datos.monto !== "number" || Number.isNaN(datos.monto)) {
    throw new ErrorValidacionPago("El monto debe ser un número válido");
  }

  if (datos.monto <= 0) {
    throw new ErrorValidacionPago("El monto debe ser mayor a cero");
  }

  const metodosValidos: MethodoPago[] = ["tarjeta", "transferencia", "billetera", "efectivo"];
  if (!metodosValidos.includes(datos.methodoPago)) {
    throw new ErrorValidacionPago(
      `Método de pago no válido. Use uno de: ${metodosValidos.join(", ")}`
    );
  }
}

/// Valida que el monto esté dentro de los límites de la cuenta

function validarMontoEnLimites(
  monto: number,
  cuenta: EstadoCuenta
): void {
  if (monto < cuenta.montoMinimo) {
    throw new ErrorValidacionPago(
      `El monto mínimo permitido es ${cuenta.montoMinimo}`
    );
  }

  if (monto > cuenta.montoMaximo) {
    throw new ErrorValidacionPago(
      `El monto máximo permitido es ${cuenta.montoMaximo}`
    );
  }

  if (monto > cuenta.saldoDisponible) {
    throw new ErrorValidacionPago(
      `Saldo insuficiente. Saldo disponible: ${cuenta.saldoDisponible}`
    );
  }
}

/// Genera un ID único de transacción

function generarIdTransaccion(): string {
  const timestamp = Date.now().toString(36);
  const aleatorio = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${aleatorio}`.toUpperCase();
}

/// Procesa el pago de un usuario

export function procesarPago(
  datos: DatosPago,
  cuenta: EstadoCuenta
): ResultadoPago {
  try {
    // Validar datos de entrada
    validarDatosPago(datos);
    validarMontoEnLimites(datos.monto, cuenta);

    // Simular procesamiento de pago
    const idTransaccion = generarIdTransaccion();
    const fecha = new Date().toISOString();

    // En un entorno real, aquí se integraría con la pasarela de pagos
    // y se actualizaría el saldo de la cuenta

    return {
      exitoso: true,
      idTransaccion: idTransaccion,
      mensaje: "Pago procesado correctamente",
      fecha: fecha,
    };
  } catch (error) {
    if (error instanceof ErrorValidacionPago) {
      return {
        exitoso: false,
        mensaje: error.message,
      };
    }

    // Error inesperado
    const mensajeError =
      error instanceof Error ? error.message : "Error desconocido";
    throw new ErrorProcesamientoPago(
      `Error inesperado al procesar el pago: ${mensajeError}`
    );
  }
}
