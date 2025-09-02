// src/features/gimnastas/screens/GimnastaProfileScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { getColor } from "@/design/colorHelper";
import { useResponsive } from "@/shared/hooks/useResponsive";
import BaseLayout from "@/shared/components/layout/BaseLayout";
import Header from "@/shared/components/layout/Header";
import { shadowStyles } from "@/styles/shadowStyles";
import { MainStackParamList } from "@/navigation/MainNavigator";

import { gimnastaProfileService, GimnastaPerfil } from "@/services/api/gimnastas/gimnastaProfileService";
import { puntajesRutService, CampeonatoParticipacion } from "@/services/api/gimnastas/puntajesRutService";
import { resultadosService, ResultadoIndividual } from "@/services/api/resultados/resultadosService";

type GimnastaProfileRouteProp = RouteProp<MainStackParamList, "GimnastaProfile">;
type GimnastaProfileNavigationProp = NavigationProp<MainStackParamList>;
type AparatoGAF = "Salto" | "Asimetricas" | "Viga" | "Suelo";

export default function GimnastaProfileScreen() {
  const route = useRoute<GimnastaProfileRouteProp>();
  const navigation = useNavigation<GimnastaProfileNavigationProp>();
  const responsive = useResponsive();
  const { gimnastaId } = route.params;

  const [gimnasta, setGimnasta] = useState<GimnastaPerfil | null>(null);
  const [campeonatos, setCampeonatos] = useState<CampeonatoParticipacion[]>([]);
  const [resultados, setResultados] = useState<ResultadoIndividual[]>([]);
  const [campeonatoSeleccionado, setCampeonatoSeleccionado] = useState<number>(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [datosActuales, setDatosActuales] = useState<GimnastaPerfil | null>(null);
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingCampeonatos, setIsLoadingCampeonatos] = useState(false);
  const [isLoadingResultados, setIsLoadingResultados] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGimnastaPerfil = async () => {
      try {
        setIsLoadingProfile(true);
        setError(null);
        const perfilData = await gimnastaProfileService.getGimnastaPerfil(gimnastaId);
        setGimnasta(perfilData);

        if (perfilData.rut) {
          await loadCampeonatos(perfilData.rut);
        }
        
        // Establecer datos actuales con el perfil inicial
        setDatosActuales(perfilData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar perfil del gimnasta');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadGimnastaPerfil();
  }, [gimnastaId]);

  const loadCampeonatos = async (rut: string) => {
    try {
      setIsLoadingCampeonatos(true);
      const campeonatosData = await puntajesRutService.getCampeonatosPorRut(rut);
      setCampeonatos(campeonatosData);
      
      if (campeonatosData.length > 0) {
        await loadResultados(campeonatosData[0], 0);
      }
    } catch (err: any) {
      // Error al cargar campeonatos - mostrar estado de error si es necesario
    } finally {
      setIsLoadingCampeonatos(false);
    }
  };

  const loadResultados = async (campeonato: CampeonatoParticipacion, index: number) => {
    if (!gimnasta) return;

    try {
      setIsLoadingResultados(true);
      
      // Obtener el perfil específico de esta participación para obtener los IDs correctos
      const perfilParticipacion = await gimnastaProfileService.getGimnastaPerfil(campeonato.participante.idParticipante);
      
      const resultadosData = await resultadosService.getResultadosIndividuales({
        campeonatoId: campeonato.campeonatoId,
        categoriaId: perfilParticipacion.ultimoCampeonato.categoriaId,
        nivelId: perfilParticipacion.ultimoCampeonato.nivelId,
        franjaId: perfilParticipacion.ultimoCampeonato.franjaId,
        participanteId: campeonato.participante.idParticipante
      });
      
      setResultados(resultadosData);
      setCampeonatoSeleccionado(index);
      setDatosActuales(perfilParticipacion);
    } catch (err: any) {
      // Error al cargar resultados - mostrar estado vacío
      setResultados([]);
    } finally {
      setIsLoadingResultados(false);
    }
  };

  const handleCampeonatoChange = async (index: number) => {
    setDropdownVisible(false);
    await loadResultados(campeonatos[index], index);
  };

  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getPositionColor = (posicion: number) => {
    if (posicion === 1) return getColor.secondary[500];
    if (posicion === 2) return getColor.gray[400];
    if (posicion === 3) return "#CD7F32";
    return getColor.gray[600];
  };

  const getAparatoDisplayName = (aparato: string) => {
    const names: Record<string, string> = {
      "Salto": "Salto",
      "Asimetricas": "Asimétricas", 
      "Viga": "Viga",
      "Suelo": "Suelo",
    };
    return names[aparato] || aparato;
  };

  const calculateAllAround = () => {
    if (resultados.length === 0) return 0;
    const totalPuntaje = resultados.reduce((sum, resultado) => sum + resultado.puntaje, 0);
    return Math.round(totalPuntaje * 10) / 10;
  };

  if (error || (!isLoadingProfile && !gimnasta)) {
    return (
      <BaseLayout>
        <Header
          title="Error"
          subtitle="Gimnasta no encontrado"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showLogo={false}
        />
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: responsive.spacing.xl,
        }}>
          <Ionicons
            name="alert-circle"
            size={64}
            color={getColor.error[500]}
            style={{ marginBottom: responsive.spacing.lg }}
          />
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: "600",
            color: getColor.error[500],
            fontFamily: "Nunito",
            textAlign: "center",
            marginBottom: responsive.spacing.sm,
          }}>
            {error || "Gimnasta no encontrado"}
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (isLoadingProfile) {
    return (
      <BaseLayout>
        <Header
          title="Cargando..."
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showLogo={false}
        />
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <ActivityIndicator size="large" color={getColor.primary[500]} />
          <Text style={{
            fontSize: responsive.fontSize.base,
            color: getColor.primary[500],
            fontFamily: "Nunito",
            marginTop: responsive.spacing.md,
          }}>
            Cargando perfil...
          </Text>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Header
        title="Perfil del Gimnasta"
        subtitle={gimnasta?.club}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showLogo={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: responsive.spacing["3xl"],
        }}
      >
        {campeonatos.length > 1 && (
          <View style={{
            marginHorizontal: responsive.spacing.md,
            marginTop: responsive.spacing.md,
            zIndex: 10,
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: getColor.background.primary,
                borderRadius: 12,
                padding: responsive.spacing.md,
                ...shadowStyles.neutral.sm,
                borderWidth: 1,
                borderColor: getColor.primary[200],
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: isLoadingResultados ? 0.6 : 1,
              }}
              onPress={() => !isLoadingResultados && setDropdownVisible(!dropdownVisible)}
              activeOpacity={0.7}
              disabled={isLoadingResultados}
            >
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: responsive.fontSize.base,
                  fontWeight: "600",
                  color: getColor.primary[600],
                  fontFamily: "Nunito",
                }}>
                  {campeonatos[campeonatoSeleccionado]?.nombre || "Seleccionar campeonato"}
                </Text>
                <Text style={{
                  fontSize: responsive.fontSize.xs,
                  color: getColor.gray[500],
                  fontFamily: "Nunito",
                  marginTop: 2,
                }}>
                  {isLoadingResultados ? "Cargando..." : campeonatos[campeonatoSeleccionado]?.estado}
                </Text>
              </View>

              {isLoadingResultados ? (
                <ActivityIndicator size="small" color={getColor.primary[500]} />
              ) : (
                <Ionicons
                  name={dropdownVisible ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={getColor.primary[500]}
                />
              )}
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={{
                backgroundColor: getColor.background.primary,
                borderRadius: 12,
                marginTop: responsive.spacing.xs,
                ...shadowStyles.neutral.base,
                borderWidth: 1,
                borderColor: getColor.gray[200],
                overflow: "hidden",
              }}>
                {campeonatos.map((campeonato, index) => (
                  <TouchableOpacity
                    key={campeonato.campeonatoId}
                    style={{
                      padding: responsive.spacing.md,
                      borderBottomWidth: index < campeonatos.length - 1 ? 1 : 0,
                      borderBottomColor: getColor.gray[100],
                      backgroundColor: index === campeonatoSeleccionado
                        ? getColor.primary[50]
                        : "transparent",
                    }}
                    onPress={() => handleCampeonatoChange(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      fontSize: responsive.fontSize.base,
                      fontWeight: index === campeonatoSeleccionado ? "700" : "600",
                      color: index === campeonatoSeleccionado
                        ? getColor.primary[600]
                        : getColor.gray[800],
                      fontFamily: "Nunito",
                    }}>
                      {campeonato.nombre}
                    </Text>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      color: getColor.gray[500],
                      fontFamily: "Nunito",
                      marginTop: 2,
                    }}>
                      {campeonato.estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {!isLoadingCampeonatos && campeonatos.length === 0 && (
          <View style={{
            backgroundColor: getColor.background.primary,
            marginHorizontal: responsive.spacing.md,
            marginTop: responsive.spacing.lg,
            borderRadius: 16,
            padding: responsive.spacing.xl,
            alignItems: "center",
            shadowColor: getColor.gray[400],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
            borderWidth: 1,
            borderColor: getColor.gray[100],
          }}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={getColor.gray[400]}
              style={{ marginBottom: responsive.spacing.md }}
            />
            <Text style={{
              fontSize: responsive.fontSize.base,
              fontWeight: "600",
              color: getColor.gray[600],
              fontFamily: "Nunito",
              textAlign: "center",
              marginBottom: responsive.spacing.xs,
            }}>
              No hay campeonatos disponibles
            </Text>
            <Text style={{
              fontSize: responsive.fontSize.sm,
              color: getColor.gray[500],
              fontFamily: "Nunito",
              textAlign: "center",
            }}>
              Este gimnasta aún no ha participado en competencias
            </Text>
          </View>
        )}

        <View style={{
          backgroundColor: getColor.background.primary,
          marginHorizontal: responsive.spacing.md,
          marginTop: responsive.spacing.lg,
          borderRadius: 20,
          padding: responsive.spacing.xl,
          ...shadowStyles.instascore.base,
          borderWidth: 1,
          borderColor: getColor.primary[100],
        }}>
          <View style={{
            alignItems: "center",
            marginBottom: responsive.spacing.lg,
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: getColor.primary[500],
              justifyContent: "center",
              alignItems: "center",
              marginBottom: responsive.spacing.md,
            }}>
              <Text style={{
                fontSize: responsive.fontSize["2xl"],
                fontWeight: "700",
                color: getColor.background.primary,
                fontFamily: "Nunito",
              }}>
                {gimnasta ? getInitials(gimnasta.nombre) : "??"}
              </Text>
            </View>

            <Text style={{
              fontSize: responsive.fontSize["2xl"],
              fontWeight: "700",
              color: getColor.primary[600],
              fontFamily: "Nunito",
              textAlign: "center",
              marginBottom: responsive.spacing.xs,
            }}>
              {gimnasta?.nombre}
            </Text>

            {datosActuales && datosActuales.ultimoCampeonato.posicion && (
              <View style={{
                backgroundColor: getPositionColor(datosActuales.ultimoCampeonato.posicion),
                borderRadius: 20,
                paddingHorizontal: responsive.spacing.md,
                paddingVertical: responsive.spacing.sm,
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Ionicons
                  name="trophy"
                  size={16}
                  color={getColor.background.primary}
                  style={{ marginRight: responsive.spacing.xs }}
                />
                <Text style={{
                  fontSize: responsive.fontSize.sm,
                  fontWeight: "700",
                  color: getColor.background.primary,
                  fontFamily: "Nunito",
                }}>
                  {datosActuales.ultimoCampeonato.posicion}° Lugar
                </Text>
              </View>
            )}
          </View>

          {gimnasta && (
            <View style={{
              backgroundColor: getColor.gray[50],
              borderRadius: 16,
              padding: responsive.spacing.lg,
            }}>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: responsive.spacing.md,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[500],
                    fontFamily: "Nunito",
                    marginBottom: 4,
                  }}>
                    RUT
                  </Text>
                  <Text style={{
                    fontSize: responsive.fontSize.base,
                    fontWeight: "600",
                    color: getColor.gray[800],
                    fontFamily: "Nunito",
                  }}>
                    {gimnasta.rut}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[500],
                    fontFamily: "Nunito",
                    marginBottom: 4,
                  }}>
                    Año de Nacimiento
                  </Text>
                  <Text style={{
                    fontSize: responsive.fontSize.base,
                    fontWeight: "600",
                    color: getColor.gray[800],
                    fontFamily: "Nunito",
                  }}>
                    {gimnasta.año}
                  </Text>
                </View>
              </View>

              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[500],
                    fontFamily: "Nunito",
                    marginBottom: 4,
                  }}>
                    Club/Delegación
                  </Text>
                  <Text style={{
                    fontSize: responsive.fontSize.base,
                    fontWeight: "600",
                    color: getColor.gray[800],
                    fontFamily: "Nunito",
                  }}>
                    {gimnasta.club}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: responsive.fontSize.xs,
                    color: getColor.gray[500],
                    fontFamily: "Nunito",
                    marginBottom: 4,
                  }}>
                    Categoría
                  </Text>
                  <Text style={{
                    fontSize: responsive.fontSize.base,
                    fontWeight: "600",
                    color: getColor.gray[800],
                    fontFamily: "Nunito",
                  }}>
                    {datosActuales ? `${datosActuales.categoria} ${datosActuales.nivel}` : `${gimnasta.categoria} ${gimnasta.nivel}`}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {campeonatos.length > 0 && (
          <View style={{
            backgroundColor: getColor.secondary[500],
            marginHorizontal: responsive.spacing.md,
            marginTop: responsive.spacing.md,
            borderRadius: 16,
            padding: responsive.spacing.lg,
            ...shadowStyles.orange.base,
            alignItems: "center",
          }}>
          <Text style={{
            fontSize: responsive.fontSize.sm,
            fontWeight: "600",
            color: getColor.background.primary,
            fontFamily: "Nunito",
            marginBottom: responsive.spacing.xs,
          }}>
            PUNTAJE ALL AROUND
          </Text>
          {isLoadingResultados ? (
            <Text style={{
              fontSize: responsive.fontSize["4xl"],
              fontWeight: "700",
              color: getColor.background.primary,
              fontFamily: "Nunito",
            }}>
              ...
            </Text>
          ) : resultados.length === 0 || calculateAllAround() === 0 ? (
            <View style={{ alignItems: "center" }}>
              <Ionicons
                name="time-outline"
                size={32}
                color={getColor.background.primary}
                style={{ marginBottom: responsive.spacing.xs }}
              />
              <Text style={{
                fontSize: responsive.fontSize.sm,
                fontWeight: "600",
                color: getColor.background.primary,
                fontFamily: "Nunito",
                textAlign: "center",
                opacity: 0.9,
              }}>
                No hay puntajes disponibles
              </Text>
            </View>
          ) : (
            <Text style={{
              fontSize: responsive.fontSize["4xl"],
              fontWeight: "700",
              color: getColor.background.primary,
              fontFamily: "Nunito",
            }}>
              {calculateAllAround().toFixed(1)}
            </Text>
          )}
          </View>
        )}

        {campeonatos.length > 0 && (
          <View style={{
            marginHorizontal: responsive.spacing.md,
            marginTop: responsive.spacing.md,
          }}>
          <Text style={{
            fontSize: responsive.fontSize.lg,
            fontWeight: "700",
            color: getColor.primary[600],
            fontFamily: "Nunito",
            marginBottom: responsive.spacing.md,
            textAlign: "center",
          }}>
            RENDIMIENTO POR APARATO
          </Text>

          {isLoadingResultados ? (
            <View style={{
              padding: responsive.spacing.xl,
              alignItems: "center",
            }}>
              <ActivityIndicator size="small" color={getColor.primary[500]} />
              <Text style={{
                fontSize: responsive.fontSize.base,
                color: getColor.gray[500],
                fontFamily: "Nunito",
                marginTop: responsive.spacing.sm,
              }}>
                Cargando rendimiento...
              </Text>
            </View>
          ) : resultados.length === 0 ? (
            <View style={{
              backgroundColor: getColor.background.primary,
              borderRadius: 16,
              padding: responsive.spacing.xl,
              alignItems: "center",
              shadowColor: getColor.gray[400],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
              borderWidth: 1,
              borderColor: getColor.gray[100],
            }}>
              <Ionicons
                name="time-outline"
                size={48}
                color={getColor.gray[400]}
                style={{ marginBottom: responsive.spacing.md }}
              />
              <Text style={{
                fontSize: responsive.fontSize.base,
                fontWeight: "600",
                color: getColor.gray[600],
                fontFamily: "Nunito",
                textAlign: "center",
                marginBottom: responsive.spacing.xs,
              }}>
                No hay puntajes disponibles en este momento
              </Text>
              <Text style={{
                fontSize: responsive.fontSize.sm,
                color: getColor.gray[500],
                fontFamily: "Nunito",
                textAlign: "center",
              }}>
                Vuelve más tarde para ver los resultados
              </Text>
            </View>
          ) : (
            resultados.map((resultado) => {
              const porcentaje = (resultado.puntaje / 10) * 100;

              return (
                <View
                  key={resultado.aparato}
                  style={{
                    backgroundColor: getColor.background.primary,
                    borderRadius: 12,
                    padding: responsive.spacing.md,
                    marginBottom: responsive.spacing.sm,
                    shadowColor: getColor.gray[400],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: getColor.gray[100],
                  }}
                >
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: responsive.spacing.sm,
                  }}>
                    <Text style={{
                      fontSize: responsive.fontSize.lg,
                      fontWeight: "700",
                      color: getColor.primary[600],
                      fontFamily: "Nunito",
                    }}>
                      {getAparatoDisplayName(resultado.aparato)}
                    </Text>

                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: responsive.spacing.xs,
                    }}>
                      <Text style={{
                        fontSize: responsive.fontSize.xl,
                        fontWeight: "700",
                        color: getColor.gray[800],
                        fontFamily: "Nunito",
                      }}>
                        {resultado.puntaje.toFixed(1)}
                      </Text>
                      <View style={{
                        backgroundColor: getPositionColor(resultado.puesto),
                        borderRadius: 16,
                        paddingHorizontal: responsive.spacing.xs,
                        paddingVertical: 4,
                        minWidth: 32,
                        alignItems: "center",
                      }}>
                        <Text style={{
                          fontSize: responsive.fontSize.xs,
                          fontWeight: "700",
                          color: getColor.background.primary,
                          fontFamily: "Nunito",
                        }}>
                          #{resultado.puesto}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{
                    backgroundColor: getColor.gray[200],
                    borderRadius: 8,
                    height: 8,
                    overflow: "hidden",
                    marginBottom: responsive.spacing.xs,
                  }}>
                    <View style={{
                      backgroundColor: getColor.secondary[500],
                      height: "100%",
                      width: `${porcentaje}%`,
                      borderRadius: 8,
                    }} />
                  </View>

                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      color: getColor.gray[400],
                      fontFamily: "Nunito",
                    }}>
                      0.0
                    </Text>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      color: getColor.gray[400],
                      fontFamily: "Nunito",
                    }}>
                      5.0
                    </Text>
                    <Text style={{
                      fontSize: responsive.fontSize.xs,
                      color: getColor.gray[400],
                      fontFamily: "Nunito",
                    }}>
                      10.0
                    </Text>
                  </View>
                </View>
              );
            })
          )}
          </View>
        )}
      </ScrollView>
    </BaseLayout>
  );
}