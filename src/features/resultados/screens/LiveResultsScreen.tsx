// src/features/resultados/screens/LiveResultsScreen.tsx
import React, { useState, useEffect } from "react";
import {
 View,
 Text,
 ScrollView,
 TouchableOpacity,
 RefreshControl,
 Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getColor } from "@/design/colorHelper";
import { useResponsive } from "@/shared/hooks/useResponsive";
import { useAppSelector } from "@/store/hooks";
import BaseLayout from "@/shared/components/layout/BaseLayout";
import Header from "@/shared/components/layout/Header";

// Componentes optimizados
import CompactResultCard from "../components/CompactResultCard";
import DiscreteUpgradeBanner from "../components/DiscreteUpgradeBanner";
import CompactTeamCard from "../components/CompactTeamCard";

// Data - IMPORTACIONES CORREGIDAS
import {
 ResultadosCategoria,
 mockResultadosKinderF1,
 mockResultadosJuvenilGAM,
 getAparatoDisplayNameResults,
} from "../data/mockLiveResultsData";
import { getAparatoIcon, AparatoGeneral } from "../data/mockLiveData";
// ✅ IMPORTAR LOS DATOS CORRECTOS DE EQUIPOS
import { mockEquiposKinderF1 } from "../data/mockTeamResultsData";

// Navigation types
type LiveResultsRouteProp = RouteProp<
  { LiveResults: { campeonatoId: string; categoriaId: string } },
  "LiveResults"
>;

interface LiveResultsState {
 resultados: ResultadosCategoria | null;
 vistaSeleccionada: "aparatos" | "allaround" | "equipos";
 isLoading: boolean;
 isRefreshing: boolean;
 error: string | null;
 showUpgradeBanner: boolean;
}

export default function LiveResultsScreen() {
 const route = useRoute<LiveResultsRouteProp>();
 const navigation = useNavigation();
 const responsive = useResponsive();
 const { isPro } = useAppSelector((state) => state.auth);

 const { campeonatoId, categoriaId } = route.params || {
   campeonatoId: "1",
   categoriaId: "cat1",
 };

 const [state, setState] = useState<LiveResultsState>({
   resultados: null,
   vistaSeleccionada: "aparatos", // Foco en el aparato actual
   isLoading: true,
   isRefreshing: false,
   error: null,
   showUpgradeBanner: !isPro, // Solo mostrar si no es Pro
 });

 // Cargar datos iniciales
 useEffect(() => {
   loadResultados();
 }, [campeonatoId, categoriaId]);

 // Simular WebSocket updates
 useEffect(() => {
   const interval = setInterval(() => {
     if (state.resultados && !state.isLoading) {
       simulateWebSocketUpdate();
     }
   }, 15000); // Cada 15 segundos

   return () => clearInterval(interval);
 }, [state.resultados, state.isLoading]);

 const loadResultados = async () => {
   try {
     setState((prev) => ({ ...prev, isLoading: true, error: null }));
     await new Promise((resolve) => setTimeout(resolve, 800));

     const resultados = categoriaId === "cat1" 
       ? mockResultadosKinderF1 
       : mockResultadosJuvenilGAM;

     setState((prev) => ({
       ...prev,
       resultados,
       isLoading: false,
     }));
   } catch (error) {
     setState((prev) => ({
       ...prev,
       error: "Error al cargar los resultados",
       isLoading: false,
     }));
   }
 };

 const simulateWebSocketUpdate = () => {
   setState((prev) => {
     if (!prev.resultados) return prev;

     const updatedResultados = { ...prev.resultados };
     const randomIndex = Math.floor(Math.random() * updatedResultados.gimnastas.length);
     const randomGimnasta = { ...updatedResultados.gimnastas[randomIndex] };

     if (randomGimnasta.puntajes[updatedResultados.aparatoActual] === null) {
       const nuevoPuntaje = Math.round((Math.random() * 2 + 7) * 10) / 10;
       randomGimnasta.puntajes[updatedResultados.aparatoActual] = nuevoPuntaje;
       randomGimnasta.allAround += nuevoPuntaje;
       updatedResultados.gimnastas[randomIndex] = randomGimnasta;
       updatedResultados.ultimaActualizacion = new Date().toISOString();
     }

     return {
       ...prev,
       resultados: updatedResultados,
     };
   });
 };

 const handleRefresh = async () => {
   setState((prev) => ({ ...prev, isRefreshing: true }));
   await loadResultados();
   setState((prev) => ({ ...prev, isRefreshing: false }));
 };

 const handleVistaChange = (vista: "aparatos" | "allaround" | "equipos") => {
   setState((prev) => ({ ...prev, vistaSeleccionada: vista }));
 };

 const handleDismissBanner = () => {
   setState((prev) => ({ ...prev, showUpgradeBanner: false }));
 };

 // ✅ FUNCIÓN HELPER PARA OBTENER DATOS DE EQUIPOS SEGÚN CATEGORÍA
 const getEquiposData = () => {
   // Por ahora solo tenemos datos para Kinder F1
   if (categoriaId === "cat1") {
     return mockEquiposKinderF1;
   }
   // Para otras categorías, retornar array vacío o datos mock generales
   return [];
 };

 // Extraer resultados al inicio para evitar errores de scope
 const resultados = state.resultados;
 const equiposData = getEquiposData();

 if (state.isLoading && !state.isRefreshing) {
   return (
     <BaseLayout>
       <Header title="Resultados En Vivo" showBack={true} onBackPress={() => navigation.goBack()} />
       <View style={{
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
         padding: responsive.spacing.xl,
       }}>
         <Ionicons name="radio" size={48} color={getColor.secondary[500]} />
         <Text style={{
           fontSize: responsive.fontSize.lg,
           fontWeight: "600",
           color: getColor.secondary[500],
           fontFamily: "Nunito",
           textAlign: "center",
           marginTop: responsive.spacing.md,
         }}>
           Cargando resultados...
         </Text>
       </View>
     </BaseLayout>
   );
 }

 if (!resultados) {
   return (
     <BaseLayout>
       <Header title="Error" showBack={true} onBackPress={() => navigation.goBack()} />
       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Text>Error al cargar resultados</Text>
       </View>
     </BaseLayout>
   );
 }

 const gimnastasToShow = isPro ? resultados.gimnastas : resultados.gimnastas.slice(0, 3);
 const equiposToShow = isPro ? equiposData : equiposData.slice(0, 3);

 return (
   <BaseLayout>
     {/* Header con categoría prominente */}
     <Header 
       title={resultados.categoriaNombreCorto || "Categoría"}
       subtitle={resultados.campeonatoNombre || "Campeonato"}
       showBack={true} 
       onBackPress={() => navigation.goBack()}
     />

     {/* Header de aparato actual compacto - Solo mostrar si no es vista de equipos */}
     {state.vistaSeleccionada !== 'equipos' && (
       <View style={{
         backgroundColor: getColor.secondary[50],
         paddingHorizontal: responsive.spacing.md,
         paddingVertical: responsive.spacing.md,
         borderBottomWidth: 1,
         borderBottomColor: getColor.secondary[200],
       }}>
         <View style={{
           flexDirection: "row",
           justifyContent: "space-between",
           alignItems: "center",
         }}>
           {/* Info del aparato */}
           <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
             <Ionicons
               name={getAparatoIcon(resultados.aparatoActual as AparatoGeneral) as any}
               size={30}
               color={getColor.secondary[700]}
               style={{ marginRight: responsive.spacing.sm }}
             />
             <View>
               <Text style={{
                 fontSize: responsive.fontSize.lg,
                 fontWeight: "800",
                 color: getColor.secondary[700],
                 fontFamily: "Nunito",
               }}>
                 {getAparatoDisplayNameResults(resultados.aparatoActual)}
               </Text>
             </View>
           </View>

           {/* Indicador EN VIVO compacto */}
           <View style={{
             flexDirection: "row",
             alignItems: "center",
             backgroundColor: getColor.secondary[500],
             borderRadius: 12,
             paddingHorizontal: responsive.spacing.sm,
             paddingVertical: 4,
           }}>
             <View style={{
               width: 6,
               height: 6,
               borderRadius: 3,
               backgroundColor: getColor.background.primary,
               marginRight: 4,
             }} />
             <Text style={{
               fontSize: responsive.fontSize.xs,
               fontWeight: "600",
               color: getColor.background.primary,
               fontFamily: "Nunito",
             }}>
               EN VIVO
             </Text>
           </View>
         </View>
       </View>
     )}

     {/* Selector de vista minimalista */}
     <View style={{
       flexDirection: "row",
       paddingHorizontal: responsive.spacing.md,
       paddingVertical: responsive.spacing.sm,
       backgroundColor: getColor.background.primary,
       gap: responsive.spacing.xs,
     }}>
       {[
         { key: "aparatos" as const, label: "Por Aparatos", icon: "radio" as const },
         { key: "allaround" as const, label: "All Around", icon: "trophy" as const },
         { key: "equipos" as const, label: "Por Equipos", icon: "people" as const },
       ].map((option) => (
         <TouchableOpacity
           key={option.key}
           style={{
             flex: 1,
             flexDirection: "row",
             alignItems: "center",
             justifyContent: "center",
             backgroundColor: state.vistaSeleccionada === option.key 
               ? getColor.secondary[500] 
               : getColor.gray[100],
             borderRadius: 8,
             paddingVertical: responsive.spacing.sm,
           }}
           onPress={() => handleVistaChange(option.key)}
         >
           <Ionicons
             name={option.icon as any}
             size={14}
             color={state.vistaSeleccionada === option.key 
               ? getColor.background.primary 
               : getColor.gray[600]
             }
             style={{ marginRight: 4 }}
           />
           <Text style={{
             fontSize: responsive.fontSize.xs,
             fontWeight: "600",
             color: state.vistaSeleccionada === option.key 
               ? getColor.background.primary 
               : getColor.gray[600],
             fontFamily: "Nunito",
           }}>
             {option.label}
           </Text>
         </TouchableOpacity>
       ))}
     </View>

     <ScrollView
       style={{ flex: 1 }}
       showsVerticalScrollIndicator={false}
       refreshControl={
         <RefreshControl
           refreshing={state.isRefreshing}
           onRefresh={handleRefresh}
           tintColor={getColor.secondary[500]}
           colors={[getColor.secondary[500]]}
         />
       }
     >
       {/* Banner upgrade colapsable discreto */}
       {!isPro && state.showUpgradeBanner && (
         <DiscreteUpgradeBanner
           onUpgrade={() => console.log("Navigate to upgrade")}
           onDismiss={handleDismissBanner}
         />
       )}

       {/* Lista de resultados con cards compactas */}
       <View style={{ padding: responsive.spacing.md }}>
         {state.vistaSeleccionada === 'equipos' ? (
           equiposData.length > 0 ? (
             <>
               {equiposToShow.map((equipo, index) => (
                 <CompactTeamCard
                   key={equipo.id}
                   equipo={equipo}
                   position={index + 1}
                 />
               ))}
               {/* Prompt para upgrade equipos */}
               {!isPro && equiposData.length > 3 && (
                 <TouchableOpacity
                   style={{
                     backgroundColor: getColor.gray[50],
                     borderRadius: 12,
                     padding: responsive.spacing.lg,
                     alignItems: "center",
                     borderWidth: 2,
                     borderColor: getColor.gray[200],
                     borderStyle: "dashed",
                     marginTop: responsive.spacing.sm,
                   }}
                   onPress={() => Alert.alert("Upgrade", "Actualiza a Pro para ver todos los equipos")}
                 >
                   <Ionicons name="people" size={24} color={getColor.gray[400]} />
                   <Text style={{
                     fontSize: responsive.fontSize.sm,
                     color: getColor.gray[500],
                     textAlign: "center",
                     marginTop: responsive.spacing.xs,
                     fontFamily: "Nunito",
                   }}>
                     +{equiposData.length - 3} equipos más en Pro
                   </Text>
                 </TouchableOpacity>
               )}
             </>
           ) : (
             // ✅ MENSAJE CUANDO NO HAY EQUIPOS
             <View style={{
               backgroundColor: getColor.gray[50],
               borderRadius: 12,
               padding: responsive.spacing.xl,
               alignItems: "center",
               marginTop: responsive.spacing.lg,
             }}>
               <Ionicons name="people-outline" size={48} color={getColor.gray[400]} />
               <Text style={{
                 fontSize: responsive.fontSize.base,
                 fontWeight: "600",
                 color: getColor.gray[600],
                 textAlign: "center",
                 marginTop: responsive.spacing.md,
                 fontFamily: "Nunito",
               }}>
                 Sin datos de equipos
               </Text>
               <Text style={{
                 fontSize: responsive.fontSize.sm,
                 color: getColor.gray[500],
                 textAlign: "center",
                 marginTop: responsive.spacing.xs,
                 fontFamily: "Nunito",
               }}>
                 Los resultados por equipos no están disponibles para esta categoría
               </Text>
             </View>
           )
         ) : (
           // Vista normal (gimnastas individuales) - SIN CAMBIOS
           <>
             {gimnastasToShow.map((gimnasta, index) => (
               <CompactResultCard
                 key={gimnasta.id}
                 gimnasta={gimnasta}
                 position={index + 1}
                 aparatoActual={resultados.aparatoActual}
                 vistaSeleccionada={state.vistaSeleccionada}
                 isHighlighted={index === 0}
               />
             ))}

             {/* Prompt para upgrade gimnastas */}
             {!isPro && resultados.gimnastas.length > 3 && (
               <TouchableOpacity
                 style={{
                   backgroundColor: getColor.gray[50],
                   borderRadius: 12,
                   padding: responsive.spacing.lg,
                   alignItems: "center",
                   borderWidth: 2,
                   borderColor: getColor.gray[200],
                   borderStyle: "dashed",
                   marginTop: responsive.spacing.sm,
                 }}
                 onPress={() => Alert.alert("Upgrade", "Actualiza a Pro para ver todos los resultados")}
               >
                 <Ionicons name="lock-closed" size={24} color={getColor.gray[400]} />
                 <Text style={{
                   fontSize: responsive.fontSize.sm,
                   color: getColor.gray[500],
                   textAlign: "center",
                   marginTop: responsive.spacing.xs,
                   fontFamily: "Nunito",
                 }}>
                   +{resultados.gimnastas.length - 3} resultados más en Pro
                 </Text>
               </TouchableOpacity>
             )}
           </>
         )}
       </View>

       {/* Footer con timestamp */}
       <View style={{
         padding: responsive.spacing.md,
         alignItems: "center",
         borderTopWidth: 1,
         borderTopColor: getColor.gray[100],
       }}>
         <Text style={{
           fontSize: responsive.fontSize.xs,
           color: getColor.gray[400],
           fontFamily: "Nunito",
         }}>
           Última actualización: {new Date(resultados.ultimaActualizacion).toLocaleTimeString()}
         </Text>
       </View>
     </ScrollView>
   </BaseLayout>
 );
}