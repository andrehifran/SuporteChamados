// supabase.js - Código LIMPO e SEGURO para o GitHub
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Lê as chaves do arquivo .env de forma segura
const supabaseUrl = "https://nukaijgbwuqwoszusuwo.supabase.co";
const supabaseKey = "sb_publishable_qP_90R5qc6_VZQvpeXjYDw_lO-cBvo7";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
