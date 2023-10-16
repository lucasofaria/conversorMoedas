import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import PickerItem from './src/Picker';
import api from './src/services/api';

export default function App(){
  const [ moedas, setMoedas ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ moedaSelecionada, setMoedaSelecionada ] = useState(null);
  const [ moedaBvalor, setMoedaBValor ] = useState("");
  const [ valorMoeda, setValorMoeda ] = useState(null);
  const [ valorConvertido, setValorConvertido ] = useState(0);

  useEffect(() => {
    async function loadMoedas(){
      const response = await api.get("all");
      let arrayMoedas = [];

      Object.keys(response.data).map( (key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        })
      })
      setMoedas(arrayMoedas);
      setMoedaSelecionada(arrayMoedas[0].key);
      setLoading(false);
    }

    loadMoedas();

  }, [])

  async function converter(){
    if(moedaBvalor === 0 || moedaBvalor === "" || moedaSelecionada === null){
      return;
    }

    const response = await api.get(`/all/${moedaSelecionada}-BRL`)
    console.log(response.data[moedaSelecionada].ask);
    
    let resultado = ( response.data[moedaSelecionada].ask * parseFloat(moedaBvalor) )

    setValorConvertido(`${resultado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`)
    setValorMoeda(moedaBvalor)

    Keyboard.dismiss();
  }
  
  if(loading){
    return(
      <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#101215" }}>
        <ActivityIndicator color="#FFF" size="large" />    
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>
          Selecione sua moeda
        </Text>

        <PickerItem 
          moedas={moedas}
          moedaSelecionada={moedaSelecionada}
          onChange={ (moedas) => setMoedaSelecionada(moedas) }
        />
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.titulo}>Digite um valor para converter em (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 1.50"
          keyboardType="numeric"
          value={moedaBvalor}
          onChangeText={ (valor) => setMoedaBValor(valor) }
        />
      </View>

      <TouchableOpacity style={styles.areaBotao} onPress={converter}>
        <Text style={styles.textBotao}> Converter </Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
          <Text style={styles.textoConvertido}>
            {valorMoeda} {moedaSelecionada}
          </Text>

          <Text style={{ fontSize: 18, color: '#000', fontWeight: '400', margin: 8 }}>
            Corresponde a
          </Text>

          <Text style={styles.textoConvertido}>
            {valorConvertido}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#101215',
    alignItems: 'center',
  },
  areaMoeda:{
    backgroundColor: '#F9F9F9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1 
  },
  titulo:{
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 5,
    paddingLeft: 5
  },
  areaValor:{
    backgroundColor: '#F9F9F9',
    width: '90%',
    padding: 8,
    paddingBottom: 8,
  },
  input:{
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000'
  },
  areaBotao:{
    width: '90%',
    height: 40,
    backgroundColor: '#FB4B57',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  textBotao:{
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold'
  },
  areaResultado:{
    width: '90%',
    marginTop: 30,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  textoConvertido:{
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  }
});
