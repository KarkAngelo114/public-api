const { Neurex, Encode } = require("neurex")

// globals
let nrx1 = new Neurex();
let sequenceLen = 0;
let vocab;

// load models and configuration
(async () => {

    await nrx1.loadSavedModel("neurex-models/spam-detector.nrx");
    sequenceLen = await nrx1.get_miscellaneous_data().sequence_length;
    vocab = await nrx1.get_miscellaneous_data().vocab;
    nrx1.configure({onFLoat32Module:true})

})();

// text classification: Ham vs Spam
const ClassifyText = async (req, res) => {
    try {
        const start = performance.now();
        const { textInput } = req.body;

        if (!textInput) {
            return res.statu(400).json({message:"Please provide an input"});
        }

        // encode text
        const input = Encode(textInput, vocab, sequenceLen);

        // run inference
        const output = await nrx1.predict([input]);
        const score = Array.from(output[0]); // get the output

        const data = {
            rawSore: score, // get the output
            predictedClass: output[0] > 0.5 ? "SPAM":"HAM",
            inferenceDuration: `Took ${(performance.now() - start).toFixed(4)}ms`, 
        }

        return res.status(200).json(data);

    }
    catch (e) {
        return res.statu(500).json({message:"Internal Server Error"});
    }
}

module.exports = {
    ClassifyText
}