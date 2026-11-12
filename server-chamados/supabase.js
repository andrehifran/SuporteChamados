// supabase.js - Código LIMPO e SEGURO para o GitHub
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Lê as chaves do arquivo .env de forma segura
const supabaseUrl = "aqui sua url";
const supabaseKey = "aqui sua apikey";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
