from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "Informe_Reserva_de_Canchas_borrador.docx"
MOCKUPS = ROOT / "entregables" / "bocetos_figma"

doc = Document()
section = doc.sections[0]
section.top_margin = Inches(.55)
section.bottom_margin = Inches(.55)
section.left_margin = Inches(.62)
section.right_margin = Inches(.62)
styles = doc.styles
styles["Normal"].font.name = "Aptos"
styles["Normal"].font.size = Pt(9)
styles["Normal"].paragraph_format.space_after = Pt(3)
styles["Normal"].paragraph_format.line_spacing = 1.02
for name, size in [("Title", 22), ("Heading 1", 15), ("Heading 2", 11)]:
    styles[name].font.name = "Aptos Display"
    styles[name].font.size = Pt(size)
    styles[name].font.bold = True
    styles[name].font.color.rgb = RGBColor(0, 0, 0)
    styles[name].paragraph_format.space_before = Pt(5)
    styles[name].paragraph_format.space_after = Pt(3)

def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)

def set_cell(cell, text, bold=False, color=None, size=8):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1
    r = p.add_run(str(text))
    r.bold = bold
    r.font.name = "Aptos"
    r.font.size = Pt(size)
    if color:
        r.font.color.rgb = RGBColor(*color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

def table(headers, rows, widths=None, font_size=8):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = "Table Grid"
    t.autofit = False
    for i, h in enumerate(headers):
        set_cell(t.rows[0].cells[i], h, True, (255,255,255), font_size)
        shade(t.rows[0].cells[i], "174A35")
    for ridx, row in enumerate(rows):
        cells = t.add_row().cells
        for i, value in enumerate(row):
            set_cell(cells[i], value, False, None, font_size)
            if ridx % 2:
                shade(cells[i], "F1F5F3")
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Inches(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return t

def heading(text, level=1):
    doc.add_heading(text, level=level)

def para(text, bold_prefix=None):
    p = doc.add_paragraph()
    if bold_prefix and text.startswith(bold_prefix):
        p.add_run(bold_prefix).bold = True
        p.add_run(text[len(bold_prefix):])
    else:
        p.add_run(text)
    return p

def new_page():
    doc.add_page_break()

# 1. Portada y contexto
p = doc.add_paragraph(style="Title")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run("Sistema de reserva de canchas deportivas")
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run("Informe de análisis, diseño e implementación").italic = True
para("Asignatura: Desarrollo de aplicaciones web · Caso alternativo D")
table(["Datos de entrega", "Información"], [
    ("Integrante 1 · rol", "[Completar nombre] · Frontend"),
    ("Integrante 2 · rol", "[Completar nombre] · Backend"),
    ("Paralelo / fecha", "[Completar] / [Completar]"),
], [2.0, 4.9], 9)
heading("Contexto y objetivo")
para("El proyecto organiza la consulta y reserva de canchas deportivas en Imbabura. La aplicación permite explorar espacios, filtrar por nombre, ubicación y deporte, revisar características y horarios, registrar una cancha y solicitar una reserva.")
para("La solución utiliza React y Vite en el cliente, Express en la API y Supabase para persistir canchas y reservas. El alcance implementado corresponde al caso D del documento del curso; las entidades del caso original de turismo se sustituyeron por Cancha y Reserva.")
heading("Alcance funcional")
para("El flujo principal inicia en la página de inicio, continúa con el catálogo y detalle de una cancha, consulta su disponibilidad y termina con la confirmación de la reserva. El personal puede registrar canchas. La interfaz incluye una ruta para páginas no encontradas.")
para("Estado del documento: borrador para completar. Los campos entre corchetes y las evidencias W3C, Lighthouse y capturas de la aplicación deben sustituirse por datos y pruebas del equipo antes de entregar.")

# 2. Requisitos
new_page(); heading("Requisitos funcionales y no funcionales")
table(["Código", "Tipo", "Requisito", "Prioridad"], [
    ("RF-01", "Funcional", "Listar canchas y buscar por nombre o ubicación; filtrar por deporte.", "Alta"),
    ("RF-02", "Funcional", "Consultar el detalle de una cancha, su capacidad y precio por hora.", "Alta"),
    ("RF-03", "Funcional", "Consultar horarios disponibles por fecha y duración.", "Alta"),
    ("RF-04", "Funcional", "Registrar una reserva con contacto, fecha, horario, duración y personas.", "Alta"),
    ("RF-05", "Funcional", "Rechazar fechas pasadas, horarios ocupados y grupos mayores que la capacidad.", "Alta"),
    ("RF-06", "Funcional", "Registrar una cancha validando campos, capacidad y precio.", "Media"),
    ("RF-07", "Funcional", "Mostrar una página clara con enlace al inicio cuando la ruta no existe.", "Media"),
    ("RNF-01", "Estándares", "Usar HTML en español, estructura semántica, títulos ordenados y metadatos requeridos.", "Alta"),
    ("RNF-02", "Accesibilidad", "Asociar etiquetas a campos, incluir texto alternativo y permitir uso por teclado con foco visible.", "Alta"),
    ("RNF-03", "Usabilidad", "Adaptar la interfaz a celular, tableta y computadora; mostrar carga, error y resultado.", "Alta"),
    ("RNF-04", "Persistencia", "Guardar canchas y reservas en Supabase para conservarlas al reiniciar la API.", "Alta"),
], [0.62, 0.88, 4.55, 0.75], 7.5)
para("Criterios de accesibilidad pendientes de demostrar con evidencia: validación del HTML con W3C y puntuación de accesibilidad Lighthouse ≥ 90.")

# 3. Historias de usuario
new_page(); heading("Historias de usuario y criterios de aceptación")
for title, story, criteria in [
    ("HU-01 · Encontrar una cancha", "Como visitante, quiero buscar por nombre o ubicación y filtrar por deporte para encontrar una cancha adecuada.", ["La lista se obtiene desde la API y muestra carga o error.", "Al cambiar búsqueda o deporte, la lista refleja los filtros.", "Si no hay coincidencias, aparece una explicación y una sugerencia." ]),
    ("HU-02 · Revisar una cancha", "Como visitante, quiero consultar ubicación, capacidad y precio antes de reservar.", ["El detalle se carga usando el identificador de la ruta.", "Si el identificador no existe, se muestra un error claro y un enlace para volver." ]),
    ("HU-03 · Reservar un horario", "Como cliente, quiero indicar mis datos, una fecha y un horario para reservar una cancha.", ["No se acepta una fecha pasada ni una hora que no esté disponible.", "El número de personas debe ser al menos uno y no superar la capacidad.", "Al confirmar, se informa el resultado y el total calculado por la API." ]),
    ("HU-04 · Publicar una cancha", "Como personal de la agencia, quiero registrar una cancha con sus características y precio.", ["Los campos requeridos se validan antes del envío.", "La API responde con confirmación y la cancha queda disponible en Supabase." ]),
]:
    heading(title, 2); para(story)
    for c in criteria:
        p=doc.add_paragraph(style="List Bullet"); p.paragraph_format.space_after=Pt(1); p.add_run(c)

# 4. Bocetos from the user's Figma export
new_page(); heading("Bocetos de las páginas en Figma")
para("La composición siguiente resume las vistas de computadora y celular entregadas en el archivo de Figma. Sirvieron como referencia para implementar las rutas de React.")
pages = [
    ("01 · Inicio", "01 · Inicio · Computadora.png", "01 · Inicio · Celular.png"),
    ("02 · Canchas", "02 · Canchas · Computadora.png", "02 · Canchas · Celular.png"),
    ("03 · Detalle", "03 · Detalle · Computadora.png", "03 · Detalle · Celular.png"),
    ("04 · Reserva", "04 · Reserva · Computadora.png", "04 · Reserva · Celular.png"),
    ("05 · Registrar", "05 · Registrar cancha · Computadora.png", "05 · Registrar cancha · Celular.png"),
    ("06 · No encontrada", "06 · No encontrada · Computadora.png", "06 · No encontrada · Celular.png"),
]
t = doc.add_table(rows=3, cols=2); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.autofit=False
for i,(label,desktop,mobile) in enumerate(pages):
    cell=t.cell(i//2,i%2); cell.text=""; cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
    p=cell.paragraphs[0]; p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after=Pt(1)
    r=p.add_run(label); r.bold=True; r.font.size=Pt(8)
    p=cell.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after=Pt(0)
    p.add_run().add_picture(str(MOCKUPS/desktop), width=Inches(2.5))
    p.add_run("   ")
    p.add_run().add_picture(str(MOCKUPS/mobile), width=Inches(.68))
    cell.width=Inches(3.35)
para("Diseño recibido del equipo mediante exportación de Figma; estas imágenes representan bocetos de diseño, no capturas de la aplicación en ejecución.")

# 5. Data and use cases
new_page(); heading("Modelo de datos y casos de uso")
heading("Modelo relacional", 2)
para("Cancha (1) ───────── (N) Reserva. Una cancha puede tener muchas reservas; cada reserva referencia una sola cancha mediante cancha_id.")
table(["Entidad", "Atributos principales", "Tipo / regla"], [
    ("Cancha", "id, nombre, deporte, ubicacion, capacidad, precio_por_hora", "id bigint; textos; capacidad integer > 0; precio numeric ≥ 0"),
    ("Reserva", "id, cancha_id, nombre, correo, fecha, hora_inicio, duracion_horas, numero_personas, created_at", "FK a Cancha; fecha date; hora time; duración 1–4; personas ≤ capacidad"),
], [0.9, 3.7, 2.2], 8)
para("La base se crea con el esquema de apiCanchas/schema.sql. Las funciones de Supabase horarios_disponibles y crear_reserva consultan disponibilidad y validan/inserta la reserva en una operación transaccional.")
heading("Diagrama textual de casos de uso", 2)
table(["Actor", "Casos de uso"], [
    ("Visitante / cliente", "Ver inicio; listar, buscar y filtrar canchas; consultar detalle; revisar disponibilidad; registrar reserva."),
    ("Personal de la agencia", "Registrar una cancha; verificar que aparezca en el catálogo."),
    ("Sistema", "Validar datos, evitar cruces de horario, calcular total y persistir información en Supabase."),
], [1.55, 5.25], 8)
heading("Reglas del dominio", 2)
para("Las reservas se realizan entre 08:00 y 22:00, en bloques de 1 a 4 horas. No se aceptan fechas pasadas ni superposición de horarios para una misma cancha. El total se calcula con el precio por hora multiplicado por la duración.")

# 6. Traceability and API
new_page(); heading("Matriz de trazabilidad y rutas de la API")
table(["Requisito", "Página / componente React", "Ruta Express"], [
    ("RF-01", "Canchas, TarjetaCancha", "GET /canchas?buscar=&deporte="),
    ("RF-02", "DetalleCancha", "GET /canchas/:id"),
    ("RF-03", "ReservaCancha", "GET /canchas/:id/disponibilidad?fecha=&duracionHoras="),
    ("RF-04 / RF-05", "ReservaCancha", "POST /reservas"),
    ("RF-06", "NuevaCancha", "POST /canchas"),
    ("RF-07", "NoEncontrada", "Ruta comodín de React; no requiere ruta API"),
], [1.05, 2.35, 3.4], 7.5)
table(["Método y ruta", "Propósito", "Estados principales"], [
    ("GET /", "Estado de la API", "200"),
    ("GET /canchas", "Listar y filtrar", "200"),
    ("GET /canchas/:id", "Detalle", "200 · 404"),
    ("GET /canchas/:id/disponibilidad", "Horarios libres", "200 · 400 · 404"),
    ("POST /canchas", "Crear cancha", "201 · 400"),
    ("POST /reservas", "Crear reserva y calcular total", "201 · 400 · 404"),
], [2.65, 2.75, 1.4], 7.5)
para("La persistencia en Supabase se verificó durante el desarrollo: el equipo observó la cancha creada en la tabla. El equipo también informó que la reserva y las validaciones funcionaron en Postman y desde la interfaz. Adjuntar capturas propias de Postman y Supabase para respaldar esta afirmación.")

# 7. Runtime page screenshots / results placeholder
new_page(); heading("Capturas de la aplicación y verificación funcional")
para("Pendiente: insertar capturas de la aplicación ejecutándose, una por página, con la barra del navegador visible o la URL legible. Los bocetos Figma de la página anterior no sustituyen esta evidencia.")
table(["Página", "Ruta", "Captura real"], [
    ("Inicio", "/", "[Insertar captura]"),
    ("Canchas", "/canchas", "[Insertar captura]"),
    ("Detalle", "/canchas/:id", "[Insertar captura]"),
    ("Reserva", "/reserva/:id", "[Insertar captura]"),
    ("Registrar cancha", "/nueva", "[Insertar captura]"),
    ("No encontrada", "Ruta inexistente", "[Insertar captura]"),
], [1.3, 2.15, 3.35], 8)
heading("Verificaciones funcionales reportadas", 2)
table(["Recorrido", "Resultado informado por el equipo", "Evidencia"], [
    ("Consultar canchas y filtrar", "Funciona en la aplicación", "[Captura navegador]"),
    ("Registrar cancha", "Aparece en Supabase", "[Captura Postman y tabla]"),
    ("Reservar y validar horarios/capacidad", "Funciona en la aplicación y Postman", "[Captura de reserva]"),
], [2.0, 2.9, 1.9], 7.5)

# 8. Validation and AI log
new_page(); heading("Estándares, accesibilidad y bitácora de IA")
heading("Validación W3C y Lighthouse", 2)
para("W3C Validator: [pendiente de ejecutar con la página publicada o con el HTML evaluable; insertar captura de resultado sin errores].")
para("Lighthouse accesibilidad: [pendiente de medir en Chrome; anotar puntuación real y adjuntar captura. El objetivo del caso es 90 o más].")
heading("Bitácora de uso de inteligencia artificial", 2)
table(["#", "Solicitud a IA", "Verificación / ajuste realizado por el equipo", "Aprendizaje"], [
    ("1", "Interpretar el caso del Word y comparar opciones de proyecto.", "El equipo seleccionó reserva de canchas y conservó sus campos mínimos del caso D.", "Traducir el enunciado en requisitos antes de programar."),
    ("2", "Proponer estructura API Express + Supabase y rutas para cancha/reserva.", "Se ajustaron los nombres a las tablas y columnas existentes; se probaron rutas en Postman.", "El contrato JSON debe coincidir con la API y la base."),
    ("3", "Ayudar a diagnosticar el POST de cancha que devolvía 400.", "Se corrigieron nombres/capitalización de campos del JSON y se comprobó la inserción en Supabase.", "Una clave JSON distinta también cuenta como campo ausente."),
    ("4", "Adaptar la interfaz React al estilo y distribución de Figma.", "Se revisaron las páginas conectadas con la API y el equipo confirmó el flujo web completo.", "Props, estado, rutas y fetch conectan vistas reutilizables."),
    ("5", "Buscar alternativas gratuitas de fotografía y ponerlas en las tarjetas.", "Se guardaron imágenes locales y se añadió el archivo CREDITOS.md con autoría y licencia.", "Hay que atribuir y verificar los recursos gráficos."),
], [0.3, 1.6, 2.85, 2.05], 6.7)
para("Revisen y personalicen la bitácora para que describa exactamente qué hizo cada integrante y qué comprobó. El curso exige que puedan explicar cada registro y el código en la sustentación.")

# footer with page fields
for s in doc.sections:
    f=s.footer.paragraphs[0]
    f.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    r=f.add_run("Reserva de canchas · Informe de trabajo   |   ")
    r.font.name="Aptos"; r.font.size=Pt(8); r.font.color.rgb=RGBColor(90,100,94)
    fld=OxmlElement("w:fldSimple"); fld.set(qn("w:instr"), "PAGE"); f._p.append(fld)

doc.save(OUT)
print(OUT)
