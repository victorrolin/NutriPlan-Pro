import { createClient } from "@/lib/supabase/client"

export interface DietPlan {
    id: string
    user_id: string
    pdf_url: string
    plan_name: string | null
    goal: string | null
    diet_type: string | null
    activity_level: string | null
    created_at: string
    metadata: any
}

export interface CreateDietPlanData {
    userId: string
    pdfUrl: string
    planName?: string
    goal?: string
    dietType?: string
    activityLevel?: string
    metadata?: any
}

export class DietPlanService {
    /**
     * Create a new diet plan
     */
    static async createPlan(data: CreateDietPlanData): Promise<{ plan: DietPlan | null; error: string | null }> {
        try {
            console.log("[DietPlanService] Creating plan with data:", data)
            const supabase = await createClient()
            console.log("[DietPlanService] Supabase client created")

            const insertData = {
                user_id: data.userId,
                pdf_url: data.pdfUrl,
                plan_name: data.planName || `Plano ${new Date().toLocaleDateString('pt-BR')}`,
                goal: data.goal,
                diet_type: data.dietType,
                activity_level: data.activityLevel,
                metadata: data.metadata || {}
            }
            console.log("[DietPlanService] Insert data:", insertData)

            const { data: newPlan, error } = await supabase
                .from("nutri_diet_plans")
                .insert(insertData)
                .select()
                .single()

            if (error) {
                console.error("[DietPlanService] Error creating diet plan:", error)
                return { plan: null, error: `Erro ao salvar plano alimentar: ${error.message}` }
            }

            console.log("[DietPlanService] Plan created successfully:", newPlan)
            return { plan: newPlan, error: null }
        } catch (error: any) {
            console.error("[DietPlanService] Exception in createPlan:", error)
            return { plan: null, error: error?.message || "Erro ao salvar plano" }
        }
    }

    /**
     * Get all diet plans for a user (ordered by creation date, newest first)
     */
    static async getUserPlans(userId: string): Promise<{ plans: DietPlan[]; error: string | null }> {
        try {
            console.log("[DietPlanService] Fetching plans for user:", userId)
            const supabase = await createClient()

            const { data: plans, error } = await supabase
                .from("nutri_diet_plans")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("[DietPlanService] Error fetching diet plans:", error)
                return { plans: [], error: "Erro ao carregar planos" }
            }

            console.log("[DietPlanService] Plans fetched:", plans)
            return { plans: plans || [], error: null }
        } catch (error: any) {
            console.error("[DietPlanService] Exception in getUserPlans:", error)
            return { plans: [], error: error?.message || "Erro ao carregar planos" }
        }
    }

    /**
     * Get the latest diet plan for a user
     */
    static async getLatestPlan(userId: string): Promise<{ plan: DietPlan | null; error: string | null }> {
        try {
            const supabase = await createClient()

            const { data: plan, error } = await supabase
                .from("nutri_diet_plans")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle()

            if (error) {
                console.error("[DietPlanService] Error fetching latest plan:", error)
                return { plan: null, error: "Erro ao carregar último plano" }
            }

            return { plan, error: null }
        } catch (error: any) {
            console.error("[DietPlanService] Exception in getLatestPlan:", error)
            return { plan: null, error: error?.message || "Erro ao carregar plano" }
        }
    }

    /**
     * Delete a diet plan
     */
    static async deletePlan(planId: string): Promise<{ success: boolean; error: string | null }> {
        try {
            const supabase = await createClient()

            const { error } = await supabase
                .from("nutri_diet_plans")
                .delete()
                .eq("id", planId)

            if (error) {
                console.error("[DietPlanService] Error deleting diet plan:", error)
                return { success: false, error: "Erro ao deletar plano" }
            }

            return { success: true, error: null }
        } catch (error: any) {
            console.error("[DietPlanService] Exception in deletePlan:", error)
            return { success: false, error: error?.message || "Erro ao deletar plano" }
        }
    }
}
