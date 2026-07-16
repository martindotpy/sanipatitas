import { ConditionTable } from "@sanipatitas/desktop/clinical/components/organisms/condition-table"
import { ImmunizationTable } from "@sanipatitas/desktop/clinical/components/organisms/immunization-table"
import { ObservationTable } from "@sanipatitas/desktop/clinical/components/organisms/observation-table"
import { PrescriptionTable } from "@sanipatitas/desktop/clinical/components/organisms/prescription-table"
import { ProcedureTable } from "@sanipatitas/desktop/clinical/components/organisms/procedure-table"
import { SanipatitasQR } from "@sanipatitas/desktop/core/components/atoms/sanipatitas-qr"
import type { OpenapiPatientDto } from "@sanipatitas/shared/api/client/types.gen"
import { Separator } from "@sanipatitas/ui/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@sanipatitas/ui/components/ui/sheet"
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@sanipatitas/ui/components/ui/tabs"

// Types
interface PatientDetailsSheetProps {
  patient: OpenapiPatientDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Labels
const GENDER_LABELS: Record<string, string> = {
  MALE: "Macho",
  FEMALE: "Hembra",
  UNKNOWN: "Desconocido",
}

// Component
export function PatientDetailsSheet({
  patient,
  open,
  onOpenChange,
}: PatientDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="max-h-main-h mt-header-h"
      >
        <SheetHeader>
          <SheetTitle>{patient?.name ?? "Detalles"}</SheetTitle>
        </SheetHeader>

        {patient && <SanipatitasQR uuid={patient.id} />}

        {patient && (
          <Tabs defaultValue="info">
            <TabsList className="mx-4 h-auto flex-wrap">
              <TabsTab value="info">Info</TabsTab>
              <TabsTab value="conditions">Condiciones</TabsTab>
              <TabsTab value="observations">Observaciones</TabsTab>
              <TabsTab value="immunizations">Inmunizaciones</TabsTab>
              <TabsTab value="prescriptions">Recetas</TabsTab>
              <TabsTab value="procedures">Procedimientos</TabsTab>
            </TabsList>

            <TabsPanel value="info">
              <div className="flex flex-col gap-4 px-4">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Identificador
                  </p>
                  <p className="text-sm break-all">{patient.id}</p>
                </div>

                <Separator />

                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Nombre
                  </p>
                  <p className="text-sm">{patient.name}</p>
                </div>

                <Separator />

                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Sexo
                  </p>
                  <p className="text-sm">
                    {patient.gender
                      ? (GENDER_LABELS[patient.gender] ?? patient.gender)
                      : "—"}
                  </p>
                </div>

                {patient.breed && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        Raza
                      </p>
                      <p className="text-sm">
                        {patient.breed.name}
                        {patient.breed.species && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({patient.breed.species.name})
                          </span>
                        )}
                      </p>
                    </div>
                  </>
                )}

                {patient.birthDate && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        Fecha de nacimiento
                      </p>
                      <p className="text-sm">{patient.birthDate}</p>
                    </div>
                  </>
                )}

                {patient.approximateAge && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        Edad aproximada
                      </p>
                      <p className="text-sm">{patient.approximateAge}</p>
                    </div>
                  </>
                )}

                {patient.weightKg != null && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        Peso (kg)
                      </p>
                      <p className="text-sm">{patient.weightKg}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Dueño
                  </p>
                  <p className="text-sm">
                    {patient.client.firstName} {patient.client.lastName}
                    <span className="text-muted-foreground">
                      {" "}
                      ({patient.client.idNumber})
                    </span>
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Esterilizado
                  </p>
                  <p className="text-sm">
                    {patient.isSterilized == null
                      ? "—"
                      : patient.isSterilized
                        ? "Sí"
                        : "No"}
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Fallecido
                  </p>
                  <p className="text-sm">
                    {patient.isDeceased == null
                      ? "—"
                      : patient.isDeceased
                        ? "Sí"
                        : "No"}
                  </p>
                </div>

                {patient.description && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        Descripción
                      </p>
                      <p className="text-sm whitespace-pre-wrap">
                        {patient.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsPanel>

            <TabsPanel value="conditions">
              <div className="px-4">
                <ConditionTable patientId={patient.id} />
              </div>
            </TabsPanel>

            <TabsPanel value="observations">
              <div className="px-4">
                <ObservationTable patientId={patient.id} />
              </div>
            </TabsPanel>

            <TabsPanel value="immunizations">
              <div className="px-4">
                <ImmunizationTable patientId={patient.id} />
              </div>
            </TabsPanel>

            <TabsPanel value="prescriptions">
              <div className="px-4">
                <PrescriptionTable patientId={patient.id} />
              </div>
            </TabsPanel>

            <TabsPanel value="procedures">
              <div className="px-4">
                <ProcedureTable patientId={patient.id} />
              </div>
            </TabsPanel>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  )
}
